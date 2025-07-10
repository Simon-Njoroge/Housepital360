import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PatientProfilesService } from './patient-profiles.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('patient-profiles')
export class PatientProfilesController {
  constructor(
    private readonly patientProfilesService: PatientProfilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPatientProfileDto: CreatePatientProfileDto,
  ) {
    return this.patientProfilesService.create({
      ...createPatientProfileDto,
      imageFile: file,
    });
  }

  @Get()
  findAll() {
    return this.patientProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientProfilesService.findOne(id);
  }

  @Patch('user/:userId')
updateByUserId(
  @Param('userId') userId: string,
  @Body() updatePatientProfileDto: UpdatePatientProfileDto,
) {
  return this.patientProfilesService.updateByUserId(userId, updatePatientProfileDto);
}
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientProfilesService.remove(id);
  }

  @Get('search/blood-type')
  searchByBloodType(@Query('bloodType') bloodType: string) {
    return this.patientProfilesService.searchByBloodType(bloodType);
  }

  @Get('filter/insurance-provider')
  filterByInsuranceProvider(@Query('provider') provider: string) {
    return this.patientProfilesService.filterByInsuranceProvider(provider);
  }
}
