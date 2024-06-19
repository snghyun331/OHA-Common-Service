import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('VilageForecast')
export class VilageForecastEntity {
  @PrimaryGeneratedColumn()
  weatherId: number;

  @Column({ type: 'varchar', nullable: false })
  fcstDate: string;

  @Column({ type: 'varchar', nullable: false })
  fcstTime: string;

  @Column({ type: 'numeric', nullable: false })
  nx: number;

  @Column({ type: 'numeric', nullable: false })
  ny: number;

  @Column({ type: 'varchar', nullable: false })
  POP: string;

  @Column({ type: 'varchar', nullable: false })
  PTY: string;

  @Column({ type: 'varchar', nullable: false })
  REH: string;

  @Column({ type: 'varchar', nullable: false })
  SKY: string;

  @Column({ type: 'varchar', nullable: false })
  TMP: string;

  @Column({ type: 'varchar', nullable: false })
  WSD: string;
}
