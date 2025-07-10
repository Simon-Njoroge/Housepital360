import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Session } from 'src/sessions/entities/session.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/create-auth.dto';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Login user
async login(
  loginDto: LoginDto & { forceLogin?: boolean },
  session: Session,
  res: any,
) {
  // 1. Fetch the user
  const existingUser = await this.userRepository.findOne({
    select: ['id', 'email', 'password_hash', 'role', 'must_update_password'],
    where: { email: loginDto.email.toLowerCase() },
  });

  if (!existingUser) throw new Error('User not found');

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    existingUser.password_hash,
  );
  if (!isPasswordValid) throw new Error('Invalid credentials');

  // 3. Get session fingerprint
  const currentIp = (res.req.ip || session.ip_address || '').trim();
  const currentUserAgent = (res.req.headers['user-agent'] || session.user_agent || '').trim();

  const existingSession = await this.sessionRepository.findOne({
    where: { user_id: existingUser.id, is_revoked: false },
  });

  const isDifferentDevice =
    existingSession &&
    (existingSession.ip_address !== currentIp ||
      existingSession.user_agent !== currentUserAgent);

  // 4. If user is on a new device and forceLogin is not true, reject login
  if (isDifferentDevice && !loginDto.forceLogin) {
    return {
      message: 'Active session detected on another device. Send forceLogin=true to proceed.',
      requireForceLogin: true,
      requiresPasswordUpdate: existingUser.must_update_password,
      user: {
        id: existingUser.id,
        role: existingUser.role,
        email: existingUser.email,
      },
    };
  }

  // 5. Revoke existing session if required
  if (isDifferentDevice && loginDto.forceLogin) {
    existingSession.is_revoked = true;
    await this.sessionRepository.save(existingSession);
  }

  // 6. Generate tokens
  const tokens = await this.generateTokens(existingUser, session);
  if (!tokens) throw new Error('Failed to generate tokens');

  // 7. Create or update session
  const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
  const refreshExpiresIn = Number(this.configService.getOrThrow('REFRESH_EXPIRES_IN'));

  if (isNaN(refreshExpiresIn)) throw new Error('REFRESH_EXPIRES_IN must be a valid number');

  if (existingSession && !isDifferentDevice) {
    existingSession.refresh_token = hashedRefreshToken;
    existingSession.expires_at = new Date(Date.now() + refreshExpiresIn * 1000);
    existingSession.ip_address = currentIp;
    existingSession.user_agent = currentUserAgent;
    await this.sessionRepository.save(existingSession);
    session.id = existingSession.id;
  } else {
    session.user_id = existingUser.id;
    session.refresh_token = hashedRefreshToken;
    session.expires_at = new Date(Date.now() + refreshExpiresIn * 1000);
    session.is_revoked = false;
    session.ip_address = currentIp;
    session.user_agent = currentUserAgent;
    await this.sessionRepository.save(session);
  }

  // 8. Update last login
  existingUser.last_login = new Date();
  await this.userRepository.save(existingUser);

  // 9. Set cookies
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: false,
    secure: this.configService.get('NODE_ENV') === 'production',
    sameSite: 'strict',
  });

  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: false,
    secure: this.configService.get('NODE_ENV') === 'production',
    sameSite: 'strict',
  });

  // 10. Return response
  return {
    message: existingUser.must_update_password
      ? 'Login successful. Please change your password.'
      : 'Logged in successfully',
    requiresPasswordUpdate: existingUser.must_update_password,
    requireForceLogin: false,
    user: {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    },
  };
}


  //logout user
  async logout(sessionId: string, res: Response) {
    // Find the session to revoke
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, is_revoked: false },
    });

    if (!session) {
      throw new Error('Session not found or already revoked');
    }

    // Revoke the session
    session.is_revoked = true;
    await this.sessionRepository.save(session);

    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password_hash', 'must_update_password'],
    });

    if (!user) throw new NotFoundException('User not found');

    // If not forced change, verify current password
    if (!user.must_update_password && dto.currentPassword) {
      const valid = await bcrypt.compare(
        dto.currentPassword,
        user.password_hash,
      );
      if (!valid) throw new BadRequestException('Incorrect current password');
    }

    // Update password
    const newHashed = await bcrypt.hash(dto.newPassword, 10);
    user.password_hash = newHashed;
    user.must_update_password = false;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  // refresh tokens
  async refreshTokens(refreshToken: string, res: Response) {
    // Validate the refresh token
    const session = await this.sessionRepository.findOne({
      where: { refresh_token: refreshToken, is_revoked: false },
    });

    if (!session) {
      return new Error('Invalid refresh token');
    }
    const match = await bcrypt.compare(refreshToken, session.refresh_token);
    if (!match) {
      return new Error('Invalid refresh token');
    }
    // Generate new tokens
    const tokens = await this.generateTokens(session.user, session);

    // Update the session with new tokens
    session.refresh_token = tokens.refreshToken;
    await this.sessionRepository.save(session);

    // Set cookies
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    // Return new tokens
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async changePasswordFromToken(
    token: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'), // or a special RESET_TOKEN_SECRET
      });

      return this.changePassword(payload.sub, dto);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  //helper generate tokens
  private async generateTokens(user: User, session: Session) {
    const payload = { sub: user.id, sessionId: session.id, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        expiresIn: parseInt(
          this.configService.getOrThrow('ACCESS_EXPIRES_IN'),
          10,
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
        expiresIn: parseInt(
          this.configService.getOrThrow('REFRESH_EXPIRES_IN'),
          10,
        ),
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
