import { IsEmail, IsEnum, IsOptional, IsString, IsBoolean, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password_hash?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Whether user is verified' })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}