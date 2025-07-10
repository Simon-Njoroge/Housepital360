import { Module } from '@nestjs/common';
import { QueueHistoryService } from './queue-history.service';
import { QueueHistoryController } from './queue-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueHistory } from './entities/queue-history.entity';
import { PatientQueue } from '../patient-queue/entities/patient-queue.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([QueueHistory, PatientQueue, User]),
    DatabaseModule,
  ],
  controllers: [QueueHistoryController],
  providers: [QueueHistoryService],
})
export class QueueHistoryModule {}
