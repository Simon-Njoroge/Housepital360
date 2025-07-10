import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
   try{
    const user = await this.userRepository.findOne({
      where: { id: createAuditLogDto.user_id }, 
   });

    if (!user) {
      throw new Error('User not found');
    }

    const auditLog = this.auditLogRepository.create({
      ...createAuditLogDto,
      user: user,
    });

    return await this.auditLogRepository.save(auditLog);
   } catch (error) {
     throw new Error(`Failed to create audit log: ${error.message}`);
   }
  }

  async findAll(): Promise<AuditLog[]> {
    return await this.auditLogRepository.find();
  }

  async findOne(id: string): Promise<AuditLog | null> {
    return await this.auditLogRepository.findOne({ where: { id } });
  }

  async update(id: string, updateAuditLogDto: UpdateAuditLogDto): Promise<AuditLog | null> {
    await this.auditLogRepository.update(id, updateAuditLogDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.auditLogRepository.delete(id);
  }
}
