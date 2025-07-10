import { Module } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlotsController } from './time-slots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeSlot, User]),
    DatabaseModule,
  ],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService],
})
export class TimeSlotsModule {}
