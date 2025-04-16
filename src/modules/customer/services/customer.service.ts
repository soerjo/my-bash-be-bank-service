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
    const repository = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;
    
    const customer = await repository.findOne({ where: [
      { public_account_number: createCustomerDto.public_account_number },
      { private_account_number: createCustomerDto.private_account_number },
    ] });
    if (customer) throw new BadRequestException('public_account_number or private_account_number already exist');

    const [lastCustomer] = await repository.find({ order: { id: 'DESC' }, take: 1 });
    const newCustomer = repository.create({
      ...createCustomerDto,
      private_account_number: createCustomerDto.private_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PRV"),
      public_account_number: createCustomerDto.public_account_number ?? generateUniqueNumber(lastCustomer?.id ?? 0, "PUB"),
      created_by: createCustomerDto.created_by,
      password: encryptPassword(createCustomerDto.password),
      bank_id: createCustomerDto?.bank_id,
    })
    return repository.save(newCustomer);
  }

  async resetPassword(id: number, userPayload: IJwtPayload) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if(!customer) throw new BadRequestException('Customer not found');

    const tempPassword = generateUniqueNumber(customer.id, "PWD");
    customer.temp_password = tempPassword;
    customer.password = null;
    customer.updated_by = userPayload.id;

    customer.save();

    return {tempPassword}
  }

  async setNewPassword(dto: GetBalanceDto) {
    const customer = await this.customerRepository.findOne({ where: { temp_password: dto.password } });
    if(!customer) throw new BadRequestException('Customer not found');

    customer.password = dto.password;
    customer.temp_password = null;

    customer.save();
  }

  getTotalCustomer(userPayload: IJwtPayload){
    return this.customerRepository.count({where: {bank_id: userPayload.bank_id}});
  }

  findAll(dto: FindCustomerDto, userPayload: IJwtPayload) {
    return this.customerRepository.findAll({...dto, bank_id: userPayload.bank_id});
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    return {
      id:customer.id,
      created_at:customer.created_at,
      user_id:customer.user_id,
      bank_id:customer.bank_id,
      private_account_number:customer.private_account_number,
      public_account_number:customer.public_account_number,
      password:customer.password,
      temp_password:customer.temp_password,
      full_name:customer.full_name,
      name:customer.name,
      identity_number:customer.identity_number,
      photo_url:customer.photo_url,
      province:customer.province,
      regency:customer.regency,
      district:customer.district,
      village:customer.village,
      address:customer.address,
      postal_code:customer.postal_code,
      phone:customer.phone,
      email:customer.email,
    }
  }
  
  async getBalance(dto: GetBalanceDto) {
    const result = await this.customerRepository.findOne({ where: { private_account_number: dto.private_account_number } });
    if(!result) {
      throw new BadRequestException('Invalid private number or password');
    }
    if(!validatePassword(dto.password, result.password)) {
      throw new BadRequestException('Invalid private number or password');
    }

    return {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      user_id: result.user_id,
      bank_id: result.bank_id,
      private_account_number: result.private_account_number,
      public_account_number: result.public_account_number,
      full_name: result.full_name,
      name: result.name,
      photo_url: result.photo_url,
    }
  }

  findOneByPublicAccountNumber(public_account_number: string, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;
    return repository.findOne({ where: { public_account_number } });
  }

  async findOneByPrivateAccountNumber(private_account_number: string, password: string) {
    const customer = await this.customerRepository.findOne({ where: { private_account_number } });
    if (!customer) return;
    if (customer.password && !validatePassword(password, customer.password)) return;

    return customer;
  }


  findOneById(id: number, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;
    return repository.findOne({ where: { id } });
  }

  // @Transactional()
  async update(dto: CustomerEntity, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(CustomerEntity) : this.customerRepository;

    const customer = await repository.findOne({ where:{ id: dto.id } });
    if(!customer) throw new BadRequestException('Customer not found');

    return repository.save({...customer, ...dto});
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
