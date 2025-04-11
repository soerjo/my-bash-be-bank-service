import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { EntityManager } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { FindTransactionDto } from '../dto/find-transaction.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { GetLastTransactionDto } from '../dto/getLastTransaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly customerService: CustomerService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;
    const createTransaction = repo.create({
      ...createTransactionDto,
    });
    return repo.save(createTransaction);
  }

  async getLastTransaction(dto: GetLastTransactionDto) {
    const customer = await this.customerService.findOneByPrivateAccountNumber(dto.private_number, dto.password);
    if (!customer) throw new BadRequestException('private number and password not valid!');

    return this.findAll({
      customer_account_number: customer.public_account_number,
      page: dto.page,
      take: dto.take,
      transaction_types: dto.transaction_types,
    })
  }

  findAll(dto: FindTransactionDto, userPayload?: IJwtPayload) {
    return this.transactionRepository.findAll(dto, userPayload);
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
