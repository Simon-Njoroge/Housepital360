import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/config/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GeneratePasswordModule } from 'src/common/utils/generatepassword.module';
import { EmailModule } from 'src/common/utils/email/email.module';
import { PatientProfile } from 'src/patient-profiles/entities/patient-profile.entity';
@Module({
  imports: [
    EmailModule,
    GeneratePasswordModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User,PatientProfile]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
