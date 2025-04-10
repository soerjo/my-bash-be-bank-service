import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { EntityManager, In, Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { FindTransactionDto } from '../dto/find-transaction.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository
  ) {}
  async create(createTransactionDto: CreateTransactionDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;
    const createTransaction = repo.create({
      ...createTransactionDto,
    });
    return repo.save(createTransaction);
  }

  findAll(dto: FindTransactionDto, userPayload: IJwtPayload) {
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
