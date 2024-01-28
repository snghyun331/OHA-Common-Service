import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('District-Name')
export class DistrictNameEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  hcode: string;

  @Column({ type: 'varchar', nullable: false })
  firstAddress: string;

  @Column({ type: 'varchar', nullable: false })
  secondAddress: string;

  @Column({ type: 'varchar', nullable: false })
  thirdAddress: string;
}
