import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('user/:userId')
  async getAppointmentsByUserId(@Param('userId') userId: string) {
    const result = await this.appointmentsService.findAllByUserId(userId);
    if (result.error) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.appointments };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Get('doctor/:doctorId/patients')
  async findAllPatientsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.findAllPatientsByDoctorId(doctorId);
  }

  
  @Post(':appointmentId/confirm')
  async confirmAppointment(@Param('appointmentId') appointmentId: string): Promise<{ success?: boolean; error?: string }> {
    return this.appointmentsService.confirmAppointment(appointmentId);
  }

   @Post(':appointmentId/complete')
  async completeAppointment(@Param('appointmentId') appointmentId: string) {
    const result = await this.appointmentsService.completeAppointment(appointmentId);
    if (result.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
