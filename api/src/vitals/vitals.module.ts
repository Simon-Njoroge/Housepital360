import { Module } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { VitalsController } from './vitals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vital } from './entities/vital.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from '../config/database.module';
import { RoleGuard } from 'src/common/guards/role.guard';
import { AtGuard } from 'src/common/guards/at.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Vital, User]), DatabaseModule],
  controllers: [VitalsController],
  providers: [VitalsService, RoleGuard, AtGuard],
})
export class VitalsModule {}
