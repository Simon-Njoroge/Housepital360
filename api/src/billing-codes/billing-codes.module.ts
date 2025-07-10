import { Module } from '@nestjs/common';
import { BillingCodesService } from './billing-codes.service';
import { BillingCodesController } from './billing-codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingCode } from './entities/billing-code.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([BillingCode]), DatabaseModule],
  controllers: [BillingCodesController],
  providers: [BillingCodesService],
})
export class BillingCodesModule {}
