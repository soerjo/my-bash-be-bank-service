import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { BankRepository } from '../repositories/bank.repository';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { RoleEnum } from '../../../common/constant/role.constant';
import { DataSource, Transaction } from 'typeorm';
import { UserService } from '../../../modules/user/services/user.service';
import { WarehouseService } from '../../../modules/warehouse/services/warehouse.service';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);
  
  constructor(
    private readonly dataSource: DataSource,
    private readonly bankRepository: BankRepository,
    private readonly userService: UserService,
    private readonly warehouseService: WarehouseService,
  ) {}

  @Transactional()
  async create(createBankDto: CreateBankDto, userPayload: IJwtPayload) {
    const uuid = uuidv4();
    const isNameExist = await this.bankRepository.findOneByName(createBankDto.name);
    if(isNameExist) throw new BadRequestException('Bank name already exists');

    const isAlreadyHaveBank = await this.bankRepository.findOneByOwnerId(userPayload.id);
    if(isAlreadyHaveBank) throw new BadRequestException('User already have bank');

    // return await this.dataSource.transaction(async (manager) => {
    try {
      const newBank = await this.bankRepository.createBankAccount({ ...createBankDto, trx_id: uuid });

      this.logger.log("=====================> createwarehouse");
      const newWarehouse = await this.warehouseService.createWarehouse(
        {
          name: newBank.name,
          bank_id: newBank.id,
          trx_id: uuid,
        }, 
        userPayload.token
      );

      this.logger.log("=====================> user");
      const newUser = await this.userService.createUser({
          username: newBank.name.split(' ').join('_'),
          email: newBank.email,
          role_id: RoleEnum.USER_CUSTOMER,
          bank_id: newBank.id,
          warehouse_id: newWarehouse.id,
          trx_id: uuid,
        }, 
        userPayload.token
      );

      this.logger.log("=====================> update bank");
      newBank.owner_id = newUser.id;
      await this.bankRepository.updateData(newBank)

      return {
        ...newBank,
        owner: newUser,
        warehouse: newWarehouse,
      }
    } catch (error) {
      this.logger.error(error?.message);

      await this.userService.failedCreateUser(uuid, userPayload.token);
      await this.warehouseService.failedCreateWarehouse(uuid, userPayload.token);

      if(error instanceof BadRequestException) throw new BadRequestException(error);
      throw new Error(error?.message);
    }
    // }).catch((error: any) => {
    // });
  }

  findAll(dto: any & PaginationDto, user: IJwtPayload) {
    return this.bankRepository.findAll(dto, user);
  }

  findOneByIds(id: number[]) {
    return this.bankRepository.findOneByIds(id);
  }

  findOneByName(name: string) {
    return this.bankRepository.findOneByName(name);
  }

  findOneByCode(code: string) {
    return this.bankRepository.findOneByCode(code);
  }

  findOneById(id: number) {
    return this.bankRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: any) {
    const existUser = await this.findOneById(id)
    if(!existUser) throw new BadRequestException('User not found');
    
    return this.bankRepository.save({
      ...existUser,
      ...dto
    })
  }

  remove(id: number) {
    const existUser = this.findOneById(id)
    if(!existUser) throw new BadRequestException('User not found');

    return this.bankRepository.softDelete(id)
  }
}
