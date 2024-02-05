import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictNameEntity } from './entities/district-name.entity';
import { EntityManager, Repository } from 'typeorm';
import { DistrictGridEntity } from './entities/district-grid.entity';
import { GetCodeDto } from './dto/get-code.dto';
import { FreqDistrictEntity } from './entities/freq-district.entity';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(DistrictNameEntity)
    private districtNameRepository: Repository<DistrictNameEntity>,
    @InjectRepository(DistrictGridEntity)
    private districtGridRepository: Repository<DistrictGridEntity>,
    @InjectRepository(FreqDistrictEntity)
    private freqDistrictRepository: Repository<FreqDistrictEntity>,
  ) {}

  async getNameByCode(code: string) {
    try {
      const result = await this.districtNameRepository.findOne({ where: { code } });
      if (!result) {
        throw new NotFoundException(`${code}코드번호는 지원하지 않습니다`);
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCodeByName(dto: GetCodeDto) {
    try {
      const { address } = dto;
      if (!address) {
        throw new BadRequestException('address를 입력해주세요');
      }
      const splitAddress = address.split(' ');
      const firstAddress = splitAddress.shift();
      const thirdAddress = splitAddress.pop();
      const secondAddress = splitAddress.join(' ');
      const districtNameInfo = await this.districtNameRepository.findOne({
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

  async getNameByCodes(codes) {
    try {
      if (!codes || codes.length === 0) {
        throw new BadRequestException('code가 요청되지 않았습니다');
      }
      const promises = codes.map(async (code) => {
        const result = await this.districtNameRepository.findOne({ where: { code } });
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

  async getGridByCode(code: string) {
    try {
      const gridsInfo = await this.districtGridRepository.findOne({ where: { code } });
      if (!gridsInfo) {
        throw new NotFoundException(`${code}번 코드에 대한 격자 정보가 없습니다.`);
      }

      const { nx, ny } = gridsInfo;
      return { nx, ny };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async createFreqDistrict(userId: number, dto: GetCodeDto, transactionManager: EntityManager) {
    try {
      const { code } = await this.getCodeByName(dto);
      const freqInfo = await this.freqDistrictRepository.findOne({ where: { code, userId } });
      if (freqInfo) {
        throw new ConflictException('해당 지역을 이미 선택했습니다');
      }
      await this.createNewFreqDistrict(code, userId, transactionManager);
      const allFreqDistricts = await this.getFreqDistricts(userId, transactionManager);
      return allFreqDistricts;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async deleteFreqDistrict(userId: number, dto: GetCodeDto, transactionManager: EntityManager) {
    try {
      const { code } = await this.getCodeByName(dto);
      const deleteResult = await transactionManager.delete(FreqDistrictEntity, { code, userId });
      if (deleteResult.affected === 0) {
        throw new ConflictException('해당 지역은 이미 삭제되었습니다');
      }
      const allFreqDistricts = await this.getFreqDistricts(userId, transactionManager);
      return allFreqDistricts;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getFreqDistricts(userId: number, transactionManager: EntityManager) {
    try {
      const results = await transactionManager.find(FreqDistrictEntity, {
        select: { code: true },
        where: { userId },
      });
      if (!results || results.length === 0) {
        throw new NotFoundException('코드 조회 결과가 없습니다');
      }
      const codes = results.map((result) => result.code);

      const districtNames = await this.getNameByCodes(codes);
      const result = districtNames.reduce((acc, item) => {
        const { firstAddress, secondAddress, thirdAddress } = item;

        // 1단계: 주소 정보 가져오기
        const firstLevel = acc[firstAddress] || {};
        const secondLevel = firstLevel[secondAddress] || [];

        // 2단계: 주소 정보 추가
        if (thirdAddress && !secondLevel.includes(thirdAddress)) {
          secondLevel.push(thirdAddress);
        }

        // 결과 데이터 갱신
        firstLevel[secondAddress] = secondLevel;
        acc[firstAddress] = firstLevel;

        return acc;
      }, {});
      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async createNewFreqDistrict(code: string, userId: number, transactionManager: EntityManager) {
    const newFreqDistrict = new FreqDistrictEntity();
    newFreqDistrict.code = code;
    newFreqDistrict.userId = userId;
    return await transactionManager.save(newFreqDistrict);
  }
}
