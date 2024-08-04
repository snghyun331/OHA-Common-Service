import { YNEnum } from 'src/common/enum/enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('district_grid')
export class DistrictGridEntity {
  @PrimaryColumn({ name: 'code',type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'nx',type: 'numeric', nullable: false })
  nx: number;

  @Column({ name: 'ny',type: 'numeric', nullable: false })
  ny: number;

  @Column({ name: 'is_hcode',type: 'enum', enum: YNEnum, nullable: false })
  isHcode: YNEnum;

  @Column({ tname: 'is_bcode',ype: 'enum', enum: YNEnum,nullable: false })
  isBcode: YNEnum;
}
