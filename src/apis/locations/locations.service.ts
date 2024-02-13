import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictNameEntity } from './entities/district-name.entity';
import { EntityManager, Repository } from 'typeorm';
import { DistrictGridEntity } from './entities/district-grid.entity';
import { FreqDistrictEntity } from './entities/freq-district.entity';
import { CreateFreqDistrictDto } from './dto/create-freq-district.dto';
import { DeleteFreqDistrictDto } from './dto/delete-freq-district.dto';
import { UpdateDefaultDistrictDto } from './dto/update-default-district.dto';
import { CurrentCoordinateDto } from './dto/current-coordinate.dto';
import { DistrictXYEntity } from './entities/district-xy.entity';
import { calculateDistance } from 'src/utils/calculate-distance';

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
    @InjectRepository(DistrictXYEntity)
    private districtXYRepository: Repository<DistrictXYEntity>,
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

  async getCodeByName(address: string) {
    try {
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
      if (!codes) {
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

  async createFreqDistrict(userId: number, dto: CreateFreqDistrictDto, transactionManager: EntityManager) {
    try {
      const { address } = dto;
      const { code } = await this.getCodeByName(address);
      // 사용자의 자주가는 지역 목록이 없다면, 맨 처음 추가하는 지역을 자동으로 default로 설정
      const checkIfNothing = await this.freqDistrictRepository.find({ where: { userId } });
      let isDefault;
      if (checkIfNothing.length === 0) {
        isDefault = true;
      }
      const freqInfo = await this.freqDistrictRepository.findOne({ where: { code, userId } });
      if (freqInfo) {
        throw new ConflictException('해당 지역을 이미 선택했습니다');
      }
      const properties = { code, userId, isDefault };
      await this.createNewFreqDistrict(properties, transactionManager);
      const allFreqDistricts = await this.getFreqDistricts(userId, transactionManager);
      return allFreqDistricts;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async deleteFreqDistrict(userId: number, dto: DeleteFreqDistrictDto, transactionManager: EntityManager) {
    try {
      const { address } = dto;
      const { code } = await this.getCodeByName(address);
      const deleteResult = await transactionManager.delete(FreqDistrictEntity, { code, userId });
      if (deleteResult.affected === 0) {
        throw new ConflictException('해당 지역은 이미 삭제되었습니다');
      }
      // 만약 디폴트로 설정된 지역이 없다면, 나머지 지역 중 하나를 자동으로 default으로 설정
      const checkIfDefaultExist = await transactionManager.findOne(FreqDistrictEntity, {
        where: { userId, isDefault: true },
      });
      if (!checkIfDefaultExist) {
        const getOneFreqDistrict = await transactionManager.findOne(FreqDistrictEntity, { where: { userId } });
        if (getOneFreqDistrict) {
          const freqId = getOneFreqDistrict.freqId;
          await transactionManager.update(FreqDistrictEntity, freqId, { isDefault: true });
        }
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
      const freqDistricts = await transactionManager.find(FreqDistrictEntity, {
        select: { code: true, isDefault: true },
        where: { userId },
      });

      if (freqDistricts.length === 0) {
        return freqDistricts;
      }

      const promises = freqDistricts.map(async (freqDistrict) => {
        const code = freqDistrict.code;
        const isDefault = freqDistrict.isDefault;
        const districtName = await this.districtNameRepository.findOne({ where: { code } });
        if (!districtName) {
          throw new NotFoundException(`code가 ${code}인 지역은 존재하지 않습니다`);
        }
        return { ...districtName, isDefault };
      });
      const results = await Promise.all(promises);

      return results;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateDefaultDistrict(userId: number, dto: UpdateDefaultDistrictDto, transaction: EntityManager) {
    const { address } = dto;
    const { code } = await this.getCodeByName(address);
    // 현재 default로 설정되어있는 위치가 설정하고자 하는 위치랑 동일하지는 않는지 검사
    const defaultFreq = await this.freqDistrictRepository.findOne({ where: { userId, isDefault: true } });
    if (!defaultFreq) {
      throw new InternalServerErrorException('데이터 정합성이 훼손되어 DB를 살퍄봐야합니다 - Default인 지역이 없음');
    }
    if (defaultFreq.code === code) {
      throw new ConflictException('해당 위치는 이미 default 입니다');
    }
    // 검사 마쳤으면 기존 디폴트 지역을 해제
    const defaultOffResult = await transaction.update(FreqDistrictEntity, defaultFreq.freqId, { isDefault: false });
    if (defaultOffResult.affected !== 1) {
      throw new BadRequestException('Default Off failed');
    }
    // 디폴트로 변경하고자 하는 지역이 자주가는 지역에 추가가 되어있는지 검사
    const freqInfo = await this.freqDistrictRepository.findOne({ where: { code, userId } });
    if (!freqInfo) {
      throw new NotFoundException('해당 위치를 추가한 적이 없습니다.');
    }
    // 검사 마쳤으면 디폴트로 설정하고자 하는 지역을 디폴트로 설정
    const defaultOnResult = await transaction.update(FreqDistrictEntity, freqInfo.freqId, { isDefault: true });
    if (defaultOnResult.affected !== 1) {
      throw new BadRequestException('Default On failed');
    }
    return;
  }

  async getDefaultDistrict(userId: number) {
    try {
      const { code } = await this.freqDistrictRepository.findOne({
        where: { userId, isDefault: true },
        select: { code: true },
      });
      if (!code) {
        throw new NotFoundException('default 지역이 없습니다');
      }
      const result = await this.getNameByCode(code);
      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getSameGridDistricts(code: string) {
    try {
      const { nx, ny } = await this.getGridByCode(code);
      const results = await this.districtGridRepository.find({ where: { nx, ny }, select: { code: true } });
      if (results.length === 0) {
        return results;
      }
      const codes = results.map((result) => result.code);
      const result = await this.getNameByCodes(codes);
      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getNearDistricts(currentCoordinate: CurrentCoordinateDto) {
    try {
      const allDistricts = await this.districtXYRepository.find({
        select: { code: true, longitude: true, latitude: true },
      });
      const sortedDistricts = [...allDistricts];

      sortedDistricts.sort((a, b) => {
        const distanceA = calculateDistance(currentCoordinate, a);
        const distanceB = calculateDistance(currentCoordinate, b);
        return distanceA - distanceB;
      });

      const slicedSortedDistricts = sortedDistricts.slice(0, 30);
      const codes = slicedSortedDistricts.map((slicedSortedDistrict) => slicedSortedDistrict.code);
      const districtNames = await this.getNameByCodes(codes);
      const result = districtNames.map((districtName, index) => ({
        code: codes[index],
        address: `${districtName.firstAddress} ${districtName.secondAddress} ${districtName.thirdAddress}`,
      }));

      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getAllDistrictsName() {
    try {
      const districtNames = await this.districtNameRepository.find({});

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

  private async createNewFreqDistrict(properties, transactionManager: EntityManager) {
    const { code, userId, isDefault } = properties;
    const newFreqDistrict = new FreqDistrictEntity();
    newFreqDistrict.code = code;
    newFreqDistrict.userId = userId;
    if (isDefault === true) {
      newFreqDistrict.isDefault = isDefault;
    }
    return await transactionManager.save(newFreqDistrict);
  }
}
