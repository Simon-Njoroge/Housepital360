import { Module } from '@nestjs/common';
import { PasswordGenerator } from './generatePassword'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PasswordGenerator],
  exports: [PasswordGenerator],
})
export class GeneratePasswordModule {}
