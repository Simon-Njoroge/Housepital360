import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


export interface JWTPayload {
  sub: string;       
  role: string;      
  iat?: number;
  exp?: number;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'), 
    });
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
   
    return payload;
  }
}
