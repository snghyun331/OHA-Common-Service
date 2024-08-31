import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DailyForecast')
export class DailyForecastEntity {
  @PrimaryGeneratedColumn()
  weatherId: number;

  @Column({ type: 'varchar', nullable: false })
  fcstDate: string;

  @Column({ type: 'numeric', nullable: false })
  nx: number;

  @Column({ type: 'numeric', nullable: false })
  ny: number;

  @Column({ type: 'varchar', nullable: false })
  TMN: string;

  @Column({ type: 'varchar', nullable: false })
  TMX: string;
}
