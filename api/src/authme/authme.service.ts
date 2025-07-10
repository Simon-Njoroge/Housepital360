import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async getUserFromAccessToken(req: Request) {
    const accessToken = req.cookies?.access_token;
    if (!accessToken) return null;

    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userService.findById(payload.sub);
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (err) {
      return null;
    }
  }
}
