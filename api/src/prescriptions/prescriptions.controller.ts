import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('create')
  async createPrescription(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    try {
      const result = await this.prescriptionsService.createPrescription(
        createPrescriptionDto,
      );
      return {
        message: 'Prescription created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error creating prescription',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch('clear/:id')
  async deletePrescription(@Param('id') id: string) {
    try {
      await this.prescriptionsService.deletePrescription(id);
      return { message: 'Prescription deleted successfully' };
    } catch (error) {
      console.error('Error deleting prescription:', error.message);
      return new HttpException(
        `Failed to delete prescription: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    try {
      return await this.prescriptionsService.findAllByUserId(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(id);
  }
}
