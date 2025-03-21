import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CustomerRepository } from '../repositories/customer.repository';
import { EntityManager } from 'typeorm';
import { FindCustomerDto } from '../dto/find-customer.dto';
import { generateUniqueNumber } from 'src/utils/unique-number-generator.util';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto, userPayload: IJwtPayload) {
    // validasi si userPayload -> not required
    const customer = await this.findOneByUserId(createCustomerDto.user_id);
    if (customer) throw new BadRequestException('Customer already exist');

    const [lastCustomer] = await this.customerRepository.find({ order: { id: 'DESC' }, take: 1 });
    return this.customerRepository.save({
      ...createCustomerDto,
      private_account_number: createCustomerDto.private_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PRV"),
      public_account_number: createCustomerDto.private_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PUB"),
      created_by: userPayload.id,
    });
  }

  findAll(dto: FindCustomerDto, userPayload: IJwtPayload) {
    return this.customerRepository.findAll(dto, userPayload)
  }

  findOne(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  findOneByUserId(user_id: number, manager?: EntityManager) {
    return this.customerRepository.findOneByUserId(user_id, manager);
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
