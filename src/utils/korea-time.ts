import { KOREA_TIME_OFFEST_TO_MILLIESEC } from './constant';

export class KoreaDate {
  koreanDateTime;

  constructor() {
    this.koreanDateTime = new Date(new Date().getTime() + KOREA_TIME_OFFEST_TO_MILLIESEC);
  }

  getFullDate() {
    const date = this.koreanDateTime.toISOString().slice(0, 10);
    const refinedDate = date.split('-').join('');
    return refinedDate;
  }

  getFullTime() {
    const fullDateString = this.koreanDateTime.toISOString();
    const time = fullDateString.substring(fullDateString.indexOf('T') + 1, fullDateString.indexOf('T') + 6);
    return time;
  }
}
