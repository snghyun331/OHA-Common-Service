import { YNEnum } from 'src/common/enum/enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('district_name')
export class DistrictNameEntity {
  @PrimaryColumn({ name: 'code',type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'first_address',type: 'varchar', nullable: false })
  firstAddress: string;

  @Column({ name: 'second_address',type: 'varchar', nullable: false })
  secondAddress: string;

  @Column({ name: 'third_address',type: 'varchar', nullable: false })
  thirdAddress: string;

  @Column({ name: 'is_hcode',type: 'enum', enum: YNEnum, nullable: false })
  isHcode: YNEnum;

  @Column({ name: 'is_bcode',type: 'enum', enum: YNEnum,nullable: false })
  isBcode: YNEnum;
}
