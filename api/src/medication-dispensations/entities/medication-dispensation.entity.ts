import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PrescriptionItem } from '../../prescription-items/entities/prescription-item.entity';
import { PharmacyInventory } from '../../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { User } from '../../user/entities/user.entity';

@Entity('medication_dispensations')
export class MedicationDispensation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  prescription_item_id: string;

  @Column({ type: 'uuid' })
  inventory_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'uuid' })
  dispensed_by: string;

  @Column({ type: 'timestamp' })
  dispensed_at: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => PrescriptionItem, (prescriptionItem) => prescriptionItem.dispensations)
  @JoinColumn({ name: 'prescription_item_id' })
  prescriptionItem: PrescriptionItem;

  @ManyToOne(() => PharmacyInventory, (inventory) => inventory.dispensations)
  @JoinColumn({ name: 'inventory_id' })
  inventory: PharmacyInventory;

  @ManyToOne(() => User, (user) => user.medicationDispensations)
  @JoinColumn({ name: 'dispensed_by' })
  dispensedBy: User;
}
