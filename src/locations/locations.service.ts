import { Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictNameEntity } from './entities/district-name.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(DistrictNameEntity)
    private locationsRepository: Repository<DistrictNameEntity>,
  ) {}

  async getNameInfo(code: string) {
    try {
      const result = await this.locationsRepository.findOne({ where: { code } });
      if (!result) {
        throw new NotFoundException(`${code}코드번호는 지원하지 않습니다`);
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
