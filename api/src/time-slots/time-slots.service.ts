import { Injectable } from '@nestjs/common';
import { CreateTimeSlotDto ,  TimeSlotResponseDto,CreateMultipleTimeSlotsDto} from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlotResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: createTimeSlotDto.doctor_id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const timeSlot = this.timeSlotRepository.create({
      ...createTimeSlotDto,
      
    });
    timeSlot.doctor_id = user.id;
   
    return this.timeSlotRepository.save(timeSlot);
    
  }

async findAll(): Promise<TimeSlot[]> {
  try {
    return await this.timeSlotRepository.find({
      where: { is_booked: false },
      relations: {
        doctor: {
          doctorProfile: true,
        },
      },
      order: { start_time: 'ASC' },
    });
  } catch (error) {
    throw new Error('Error fetching time slots');
  }
}

async findAllByUserId(userId: string): Promise<TimeSlot[]> {
    try {
      return await this.timeSlotRepository.find({
        where: { doctor_id: userId },
        relations: {
          doctor: {
            doctorProfile: true,
          },
        },
        order: { start_time: 'ASC' },
      });
    } catch (error) {
      throw new Error('Error fetching time slots for the user');
    }
  }


  async findOne(id: string): Promise<TimeSlot | null> {
    return await this.timeSlotRepository.findOne({
      where: { id: id },
      relations: ['doctor'],
    });
  }

  async update(id: string, updateTimeSlotDto: UpdateTimeSlotDto) {
    try{
      await this.timeSlotRepository.update(id, updateTimeSlotDto);
      return this.findOne(id);
    }catch(error){
      throw new Error('Error updating time slot');
    }
    
  }

  async remove(id: string) {
    try{
      await this.timeSlotRepository.delete(id);
      return { message: 'Time slot deleted successfully' };
    }catch(error){
      throw new Error('Error deleting time slot');
    }
  }
}
