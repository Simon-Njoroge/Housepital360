import { Module } from '@nestjs/common';
import { PatientProfilesService } from './patient-profiles.service';
import { PatientProfilesController } from './patient-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile, User]), DatabaseModule],
  controllers: [PatientProfilesController],
  providers: [PatientProfilesService],
})
export class PatientProfilesModule {}
