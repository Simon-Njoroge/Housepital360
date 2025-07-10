import { Controller, Post, Body, Req, Res, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Session as SessionEntity } from 'src/sessions/entities/session.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/create-auth.dto';

interface LoginDto {
  email: string;
  password: string;
  forceLogin?: boolean;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Create an empty session entity manually
    const session = new SessionEntity();

    const result = await this.authService.login(loginDto, session, res);

    return result;
  }

  @Public()
  @Post('logout/:sessionId')
  async logout(@Param('sessionId') sessionId: string, @Res() res: Response) {
    const result = await this.authService.logout(sessionId, res);
    return res.json(result);
  }

  @Post('refresh')
  async refreshTokens(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.refreshTokens(refreshToken, res);
    return res.json(result);
  }

  @Public()
  @Patch('change-password/:userId')
  async changePassword(
    @Param('userId') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }

  @Patch('change-password/:token')
  async changePasswordWithToken(
    @Param('token') token: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePasswordFromToken(token, dto);
  }
}
