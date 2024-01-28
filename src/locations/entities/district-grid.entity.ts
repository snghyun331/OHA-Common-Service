import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District-Grid')
export class DistrictGridEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  hcode: string;

  @Column({ type: 'numeric', nullable: false })
  nx: number;

  @Column({ type: 'numeric', nullable: false })
  ny: number;
}
