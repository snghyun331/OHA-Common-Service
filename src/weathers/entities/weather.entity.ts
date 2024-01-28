import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Weather')
export class WeatherEntity {
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
  precipProb: string;

  @Column({ type: 'varchar', nullable: false })
  precipType: string;

  @Column({ type: 'varchar', nullable: false })
  humidity: string;

  @Column({ type: 'varchar', nullable: false })
  sky: string;

  @Column({ type: 'varchar', nullable: false })
  tempHourly: string;

  @Column({ type: 'varchar', nullable: false })
  windSpeed: string;
}
