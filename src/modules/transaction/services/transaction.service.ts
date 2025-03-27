import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { EntityManager, In, Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;
    const createTransaction = repo.create({
      ...createTransactionDto,
    });
    return repo.save(createTransaction);
  }

  findAll() {
    return `This action returns all transaction`;
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
