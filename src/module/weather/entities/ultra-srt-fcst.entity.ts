import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ultra_srt_forecast')
export class UltraSrtForecastEntity {
  @PrimaryGeneratedColumn({name: 'weather_id'})
  weatherId: number;

  @Column({ name: 'fcst_date',type: 'varchar', nullable: false })
  fcstDate: string;

  @Column({ name: 'fcst_time',type: 'varchar', nullable: false })
  fcstTime: string;

  @Column({ name: 'nx',type: 'numeric', nullable: false })
  nx: number;

  @Column({ name: 'ny',type: 'numeric', nullable: false })
  ny: number;

  @Column({ name: 'lgt',type: 'varchar', nullable: false })
  LGT: string;
}
