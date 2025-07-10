import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './authme.service';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = await this.authService.getUserFromAccessToken(req);
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    return {
      success: true,
      data: {
        user,
      },
    };
  }
}
