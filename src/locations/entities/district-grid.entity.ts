import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District-Grid')
export class DistrictGridEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'numeric', nullable: false })
  nx: number;

  @Column({ type: 'numeric', nullable: false })
  ny: number;

  @Column({ type: 'boolean', nullable: false })
  isHcode: boolean;

  @Column({ type: 'boolean', nullable: false })
  isBcode: boolean;
}
