import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { MedicationCatalog } from '../../medication-catalog/entities/medication-catalog.entity';
import { PharmacyInventory } from '../../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { MedicationDispensation } from '../../medication-dispensations/entities/medication-dispensation.entity';

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  prescription_id: string;

  @Column({ type: 'uuid' })
  medication_id: string;

  @Column({ type: 'uuid' })
  inventory_id: string;

  @Column({ type: 'varchar' , nullable:true})
  dosage: string;

  @Column({ type: 'varchar',nullable:true })
  frequency: string;

  @Column({ type: 'varchar',nullable:true })
  duration: string;

  @Column({ type: 'int' ,nullable:true})
  quantity: number;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_price: number;

  @Column({ type: 'boolean', default: false })
  is_dispensed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dispensed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Prescription, (prescription) => prescription.prescriptionItems)
  @JoinColumn({ name: 'prescription_id' })
  prescription: Prescription;

  @ManyToOne(() => MedicationCatalog, (medication) => medication.prescriptionItems)
  @JoinColumn({ name: 'medication_id' })
  medication: MedicationCatalog;

  @ManyToOne(() => PharmacyInventory, (inventory) => inventory.prescriptionItems)
  @JoinColumn({ name: 'inventory_id' })
  inventory: PharmacyInventory;

  @OneToMany(() => MedicationDispensation, (dispensation) => dispensation.prescriptionItem)
  dispensations: MedicationDispensation[];
}
