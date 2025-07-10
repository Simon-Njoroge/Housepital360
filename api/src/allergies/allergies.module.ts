import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { User } from 'src/user/entities/user.entity';
import { Allergy } from './entities/allergy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Allergy, User]),
    DatabaseModule,
  ],
  controllers: [AllergiesController],
  providers: [AllergiesService],
})
export class AllergiesModule {}
