import { Module } from '@nestjs/common';
import { InsuranceClaimsService } from './insurance-claims.service';
import { InsuranceClaimsController } from './insurance-claims.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceClaim } from './entities/insurance-claim.entity';
import { User } from '../user/entities/user.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Payment } from '../payments/entities/payment.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([InsuranceClaim, User, Invoice, Payment]),
    DatabaseModule,
  ],
  controllers: [InsuranceClaimsController],
  providers: [InsuranceClaimsService],
})
export class InsuranceClaimsModule {}
