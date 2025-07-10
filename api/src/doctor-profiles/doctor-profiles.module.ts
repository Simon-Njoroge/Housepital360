import { Module } from '@nestjs/common';
import { DoctorProfilesService } from './doctor-profiles.service';
import { DoctorProfilesController } from './doctor-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorProfile, User]),
    UserModule,
    DatabaseModule,
  ],
  controllers: [DoctorProfilesController],
  providers: [DoctorProfilesService],
})
export class DoctorProfilesModule {}
