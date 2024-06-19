import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UltraSrtForecast')
export class UltraSrtForecastEntity {
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
  LGT: string;
}
