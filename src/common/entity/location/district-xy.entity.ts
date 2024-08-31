import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District-XY')
export class DistrictXYEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'numeric', nullable: false })
  longitude: number;

  @Column({ type: 'numeric', nullable: false })
  latitude: number;

  @Column({ type: 'boolean', nullable: false })
  isHcode: boolean;

  @Column({ type: 'boolean', nullable: false })
  isBcode: boolean;
}
