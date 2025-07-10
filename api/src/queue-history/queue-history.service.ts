import { Injectable } from '@nestjs/common';
import { CreateQueueHistoryDto } from './dto/create-queue-history.dto';
import { UpdateQueueHistoryDto } from './dto/update-queue-history.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { QueueHistory } from './entities/queue-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientQueue } from '../patient-queue/entities/patient-queue.entity';
@Injectable()
export class QueueHistoryService {
  constructor(
    @InjectRepository(QueueHistory)
    private queueHistoryRepository: Repository<QueueHistory>,
    @InjectRepository(PatientQueue)
    private patientQueueRepository: Repository<PatientQueue>,
  ) {}

  async create(createQueueHistoryDto: CreateQueueHistoryDto): Promise<QueueHistory> {
    try{

      const queueHistory = this.queueHistoryRepository.create(createQueueHistoryDto);
      const patientQueue = await this.patientQueueRepository.findOne({
        where: { id: createQueueHistoryDto.queue_id },
      });

      if (!patientQueue) {
        throw new Error('Patient Queue not found');
      }

      queueHistory.queue = patientQueue;

      return this.queueHistoryRepository.save(queueHistory);
    }catch(error){
      throw new Error('Error creating queue history');
    }
  }

  async findAll(): Promise<QueueHistory[]> {
    try{
      return await this.queueHistoryRepository.find({
        relations: ['queue'],
      });
    }catch(error){
      throw new Error('Error fetching queue history');
    }
  }

  async findOne(id: string): Promise<QueueHistory | null> {
    try{
      return await this.queueHistoryRepository.findOne({
        where: { id: id },
        relations: ['queue'],
      });
    }catch(error){
      throw new Error('Error fetching queue history');
    }
  }

  async update(id: string, updateQueueHistoryDto: UpdateQueueHistoryDto) {
    try{
      await this.queueHistoryRepository.update(id, updateQueueHistoryDto);
      return this.findOne(id);
    }catch(error){
      throw new Error('Error updating queue history');
    }
  }

  async remove(id: string) {
    try{
      await this.queueHistoryRepository.delete(id);
      return { message: 'Queue history deleted successfully' };
    }catch(error){
      throw new Error('Error deleting queue history');
    }
  }
}
