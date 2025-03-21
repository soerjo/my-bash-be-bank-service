import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { BankRepository } from '../repositories/bank.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { RoleEnum } from 'src/common/constant/role.constant';

@Injectable()
export class BankService {
  constructor(
    private readonly bankRepository: BankRepository,
  ) {}

  async create(createBankDto: CreateBankDto, userPayload: IJwtPayload) {
    const isNameExist = await this.bankRepository.findOneByName(createBankDto.name);
    if(isNameExist) throw new BadRequestException('Bank name already exists');

    const isAlreadyHaveBank = await this.bankRepository.findOneByOwnerId(userPayload.id);
    if(isAlreadyHaveBank) throw new BadRequestException('User already have bank');

    const owner_id = userPayload.role_id == RoleEnum.USER_SUPER_ADMIN_BANK ? userPayload.id : createBankDto.owner_id;
    return this.bankRepository.createBankAccount({...createBankDto, owner_id: userPayload.id});
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

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
