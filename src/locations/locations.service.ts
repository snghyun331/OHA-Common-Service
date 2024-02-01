import { BadRequestException, Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictNameEntity } from './entities/district-name.entity';
import { Repository } from 'typeorm';
import { GetDistrictCodeDto } from './dto/get-district-code.dto';
import { GetNameByCodesDto } from './dto/get-name-by-codes.dto';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(DistrictNameEntity)
    private locationsRepository: Repository<DistrictNameEntity>,
  ) {}

  async getNameInfoByCode(code: string) {
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

  async getNameInfoByCodes(dto: GetNameByCodesDto) {
    try {
      const { codes } = dto;
      if (!codes || codes.length === 0) {
        throw new BadRequestException('code가 요청되지 않았습니다');
      }
      const promises = codes.map(async (code) => {
        const result = await this.locationsRepository.findOne({ where: { code } });
        if (!result) {
          throw new NotFoundException(`code가 ${code}인 지역은 존재하지 않습니다`);
        }
        return result;
      });
      const results = await Promise.all(promises);
      return results;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
