import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Freq-District')
export class FreqDistrictEntity {
  @PrimaryGeneratedColumn()
  freqId: number;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'numeric', nullable: false })
  userId: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  isDefault: boolean;
}
