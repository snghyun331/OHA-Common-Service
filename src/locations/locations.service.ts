import { BadRequestException, Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictNameEntity } from './entities/district-name.entity';
import { Repository } from 'typeorm';
import { GetDistrictCodeDto } from './dto/get-district-code.dto';

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

  async getCodeFromDistrictName(getDistrictCodeDto: GetDistrictCodeDto) {
    try {
      const { address } = getDistrictCodeDto;
      if (!address) {
        throw new BadRequestException('address를 입력해주세요');
      }
      const splitAddress = address.split(' ');
      const firstAddress = splitAddress.shift();
      const thirdAddress = splitAddress.pop();
      const secondAddress = splitAddress.join(' ');
      const districtNameInfo = await this.locationsRepository.findOne({
        where: { firstAddress, secondAddress, thirdAddress },
      });
      if (!districtNameInfo) {
        throw new NotFoundException('주소와 일치하는 code가 없습니다');
      }
      const { code } = districtNameInfo;
      return { code };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
