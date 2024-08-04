import { YNEnum } from 'src/common/enum/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Freq-District')
export class FreqDistrictEntity {
  @PrimaryGeneratedColumn({name: 'freq_id'})
  freqId: number;

  @Column({ name: 'code',type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'user_id',type: 'numeric', nullable: false })
  userId: number;

  @Column({ name: 'is_default',type: 'enum', enum: YNEnum, default: YNEnum.NO, nullable: false })
  isDefault: YNEnum;
}
