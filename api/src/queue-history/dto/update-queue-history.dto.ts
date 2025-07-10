import { PartialType } from '@nestjs/mapped-types';
import { CreateQueueHistoryDto } from './create-queue-history.dto';

export class UpdateQueueHistoryDto extends PartialType(CreateQueueHistoryDto) {}
