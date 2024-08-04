import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vilage_forecast')
export class VilageForecastEntity {
  @PrimaryGeneratedColumn({name: 'weather_id'})
  weatherId: number;

  @Column({ name: 'fcst_date',type: 'varchar', nullable: false })
  fcstDate: string;

  @Column({ name: 'fcst_time',type: 'varchar', nullable: false })
  fcstTime: string;

  @Column({ name: 'nx',type: 'numeric', nullable: false })
  nx: number;

  @Column({ name:'ny',type: 'numeric', nullable: false })
  ny: number;

  @Column({ name: 'pop',type: 'varchar', nullable: false })
  POP: string;

  @Column({ name: 'pty',type: 'varchar', nullable: false })
  PTY: string;

  @Column({ name: 'reh',type: 'varchar', nullable: false })
  REH: string;

  @Column({ name: 'sky',type: 'varchar', nullable: false })
  SKY: string;

  @Column({ name: 'tmp',type: 'varchar', nullable: false })
  TMP: string;

  @Column({ name: 'wsd',type: 'varchar', nullable: false })
  WSD: string;
}
