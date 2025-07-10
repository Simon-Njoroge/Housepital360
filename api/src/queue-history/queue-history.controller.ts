import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueueHistoryService } from './queue-history.service';
import { CreateQueueHistoryDto } from './dto/create-queue-history.dto';
import { UpdateQueueHistoryDto } from './dto/update-queue-history.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('queue-history')
export class QueueHistoryController {
  constructor(private readonly queueHistoryService: QueueHistoryService) {}

  @Post()
  create(@Body() createQueueHistoryDto: CreateQueueHistoryDto) {
    return this.queueHistoryService.create(createQueueHistoryDto);
  }

  @Get()
  findAll() {
    return this.queueHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueHistoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueHistoryDto: UpdateQueueHistoryDto) {
    return this.queueHistoryService.update(id, updateQueueHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueHistoryService.remove(id);
  }
}
