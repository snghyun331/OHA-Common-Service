import { YNEnum } from 'src/common/enum/enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District-XY')
export class DistrictXYEntity {
  @PrimaryColumn({ name: 'code',type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'longitude',type: 'numeric', nullable: false })
  longitude: number;

  @Column({ name: 'latitude',type: 'numeric', nullable: false })
  latitude: number;

  @Column({ name: 'is_hcode',type: 'enum', enum: YNEnum, nullable: false })
  isHcode: YNEnum;

  @Column({ name: 'is_bcode',type: 'enum', enum: YNEnum,nullable: false })
  isBcode: YNEnum;
}
