import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/entities/user.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/config/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AtStrategy } from 'src/common/strategies/at.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-at' }),
   
   JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('ACCESS_EXPIRES_IN') || '15m',
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Session]),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy],
})
export class AuthModule {}
