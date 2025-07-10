import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  create(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotsService.create(createTimeSlotDto);
  }

  @Get()
  findAll() {
    return this.timeSlotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSlotsService.findOne(id);
  }

 @Get('doctor/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.timeSlotsService.findAllByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeSlotDto: UpdateTimeSlotDto) {
    return this.timeSlotsService.update(id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(id);
  }
}
