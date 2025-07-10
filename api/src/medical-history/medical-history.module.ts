import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistory, User]), DatabaseModule],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
