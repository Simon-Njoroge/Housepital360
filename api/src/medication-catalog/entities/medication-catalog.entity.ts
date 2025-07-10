import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PharmacyInventory } from '../../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { PrescriptionItem } from '../../prescription-items/entities/prescription-item.entity';

export enum MedicationForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  LIQUID = 'liquid',
  INJECTION = 'injection',
  TOPICAL = 'topical',
  SUPPOSITORY = 'suppository',
}

@Entity('medication_catalog')
export class MedicationCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  generic_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: MedicationForm,
    nullable: true,
  })
  form: MedicationForm;

  @Column({ type: 'varchar', nullable: true })
  strength: string;

  @Column({ type: 'varchar', nullable: true })
  manufacturer: string;

  @Column({ type: 'boolean', default: false })
  is_controlled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => PharmacyInventory, (inventory) => inventory.medication)
  inventory: PharmacyInventory[];

  @OneToMany(() => PrescriptionItem, (prescriptionItem) => prescriptionItem.medication)
  prescriptionItems: PrescriptionItem[];
}
