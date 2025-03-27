import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CustomerRepository } from '../repositories/customer.repository';
import { EntityManager } from 'typeorm';
import { FindCustomerDto } from '../dto/find-customer.dto';
import { generateUniqueNumber } from 'src/utils/unique-number-generator.util';
import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;
    
    const customer = createCustomerDto.user_id && await this.findOneByUserId(createCustomerDto.user_id);
    if (customer) throw new BadRequestException('Customer already exist');

    const [lastCustomer] = await repo.find({ order: { id: 'DESC' }, take: 1 });
    return repo.save({
      ...createCustomerDto,
      private_account_number: createCustomerDto.private_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PRV"),
      public_account_number: createCustomerDto.private_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PUB"),
      created_by: createCustomerDto.created_by,
    });
  }

  findAll(dto: FindCustomerDto, userPayload: IJwtPayload) {
    return this.customerRepository.findAll(dto, userPayload)
  }

  findOne(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  findOneByPublicAccountNumber(public_account_number: string) {
    return this.customerRepository.findOneBy({ public_account_number });
  }

  findOneByUserId(user_id: number, manager?: EntityManager) {
    return this.customerRepository.findOneByUserId(user_id, manager);
  }

  update(dto: CustomerEntity, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;
    return repo.save(dto);
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
