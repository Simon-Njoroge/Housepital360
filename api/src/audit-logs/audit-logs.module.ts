import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { DatabaseModule } from 'src/config/database.module';
import { User } from '../user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, User]),
    DatabaseModule,
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
})
export class AuditLogsModule {}
