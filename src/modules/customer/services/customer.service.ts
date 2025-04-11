import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { CustomerRepository } from '../repositories/customer.repository';
import { EntityManager } from 'typeorm';
import { FindCustomerDto } from '../dto/find-customer.dto';
import { generateUniqueNumber } from '../../../utils/unique-number-generator.util';
import { CustomerEntity } from '../entities/customer.entity';
import { GetBalanceDto } from '../dto/get-balance.dto';
import { encryptPassword, validatePassword } from '../../../utils/hashing.util';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto, manager?: EntityManager): Promise<CustomerEntity> {
    // console.log({createCustomerDto})
    // console.log({password: encryptPassword(createCustomerDto.password),})
    const repo = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;
    
    const customer = createCustomerDto.user_id && await this.findOneByUserId(createCustomerDto.user_id);
    if (customer) throw new BadRequestException('Customer already exist');

    const [lastCustomer] = await repo.find({ order: { id: 'DESC' }, take: 1 });
    const newCustomer = repo.create({
      ...createCustomerDto,
      private_account_number: createCustomerDto.private_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PRV"),
      public_account_number: createCustomerDto.public_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PUB"),
      created_by: createCustomerDto.created_by,
      password: encryptPassword(createCustomerDto.password),
      temp_password: createCustomerDto.password, 
    })
    return repo.save(newCustomer);
  }

  async resetPassword(id: number, userPayload: IJwtPayload) {
    const customer = await this.customerRepository.findOneBy({ id });
    if(!customer) throw new BadRequestException('Customer not found');

    const tempPassword = generateUniqueNumber(customer.id, "PWD");
    customer.temp_password = tempPassword;
    customer.password = null;
    customer.updated_by = userPayload.id;

    customer.save();

    return {tempPassword}
  }

  async setNewPassword(dto: GetBalanceDto) {
    const customer = await this.customerRepository.findOneBy({ temp_password: dto.password });
    if(!customer) throw new BadRequestException('Customer not found');

    customer.password = dto.password;
    customer.temp_password = null;

    customer.save();
  }

  findAll(dto: FindCustomerDto, userPayload: IJwtPayload) {
    return this.customerRepository.findAll(dto, userPayload)
  }

  findOne(id: number) {
    return this.customerRepository.findOneBy({ id });
  }
  
  async getBalance(dto: GetBalanceDto) {
    const result = await this.customerRepository.findOneBy({ private_account_number: dto.private_account_number, password: dto.password });

    if(!result) {
      throw new BadRequestException('Invalid private number or password');
    }

    return {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      last_transaction_id: result.last_transaction_id,
      balance: Number(result.balance),
      user_id: result.user_id,
      bank_id: result.bank_id,
      private_account_number: result.private_account_number,
      public_account_number: result.public_account_number,
      full_name: result.full_name,
      name: result.name,
      photo_url: result.photo_url,
    }
  }

  findOneByPublicAccountNumber(public_account_number: string) {
    return this.customerRepository.findOneBy({ public_account_number });
  }

  async findOneByPrivateAccountNumber(private_account_number: string, password: string) {
    const customer = await this.customerRepository.findOneBy({ private_account_number });
    if (!customer) return;
    console.log({customer})
    console.log({password})
    console.log({isvalid: validatePassword(password, customer.password)})
    if (customer.password && !validatePassword(password, customer.password)) return;

    return customer;
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
