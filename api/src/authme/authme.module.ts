import { Module } from '@nestjs/common';
import { AuthService } from './authme.service';
import { AuthController } from './authme.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // or from config
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthmeModule {}
