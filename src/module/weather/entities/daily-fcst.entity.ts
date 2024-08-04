import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('daily_forecast')
export class DailyForecastEntity {
  @PrimaryGeneratedColumn({name: 'weather_id'})
  weatherId: number;

  @Column({ name: 'fcst_date',type: 'varchar', nullable: false })
  fcstDate: string;

  @Column({ name: 'nx',type: 'numeric', nullable: false })
  nx: number;

  @Column({ name: 'ny',type: 'numeric', nullable: false })
  ny: number;

  @Column({ name: 'tmn',type: 'varchar', nullable: false })
  TMN: string;

  @Column({ name: 'tmx',type: 'varchar', nullable: false })
  TMX: string;
}
