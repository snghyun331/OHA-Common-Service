import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District')
export class DistrictEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  hcode: string;

  @Column({ type: 'varchar', nullable: false })
  firstAddress: string;

  @Column({ type: 'varchar', nullable: false })
  secondAddress: string;

  @Column({ type: 'varchar', nullable: false })
  thirdAddress: string;

  @Column({ type: 'numeric', nullable: false })
  nx: number;

  @Column({ type: 'numeric', nullable: false })
  ny: number;

  @Column({ type: 'double precision', nullable: false })
  longitude: number;

  @Column({ type: 'double precision', nullable: false })
  latitude: number;
}
