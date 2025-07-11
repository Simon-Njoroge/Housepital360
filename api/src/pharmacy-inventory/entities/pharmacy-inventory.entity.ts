import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  
} from 'typeorm';
import { MedicationCatalog } from '../../medication-catalog/entities/medication-catalog.entity';
import { PrescriptionItem } from '../../prescription-items/entities/prescription-item.entity';
import { MedicationDispensation } from '../../medication-dispensations/entities/medication-dispensation.entity';
import { MedicationRequest } from '../../medication_requests/entities/medication_request.entity';
@Entity('pharmacy_inventory')
export class PharmacyInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  medication_id: string;

  @Column({ type: 'varchar' })
  batch_number: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'date' })
  expiry_date: Date;

  @Column({ type: 'varchar', nullable: true })
  supplier: string;

  @Column({ type: 'int', nullable: true })
  reorder_level: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => MedicationCatalog, (medication) => medication.inventory)
  @JoinColumn({ name: 'medication_id' })
  medication: MedicationCatalog;

  @OneToMany(
    () => PrescriptionItem,
    (prescriptionItem) => prescriptionItem.inventory,
  )
  prescriptionItems: PrescriptionItem[];

  @OneToMany(
    () => MedicationDispensation,
    (dispensation) => dispensation.inventory,
  )
  dispensations: MedicationDispensation[];

  @OneToMany(() => MedicationRequest, (request) => request.inventory)
  medicationRequests: MedicationRequest[];
}
