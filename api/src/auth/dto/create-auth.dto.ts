// src/auth/dto/login.dto.ts
import { IsEmail, IsString, IsOptional, IsBoolean,MinLength} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  forceLogin?: boolean;
}

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  currentPassword?: string; // only required when not using token

  @IsString()
  @MinLength(6)
  newPassword: string;
}
