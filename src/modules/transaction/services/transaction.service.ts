import { BadRequestException, Injectable } from '@nestjs/common';
import { DefaultCreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { EntityManager, In } from 'typeorm';
import { FindTransactionDto } from '../dto/find-transaction.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { GetLastTransactionDto } from '../dto/getLastTransaction.dto';
import { TransactionStatusEnum } from '../../../common/constant/transaction-status.constant';
import { TransactionLogRepository } from '../repositories/transaction-log.repository';
// import { Transactional } from 'typeorm-transactional-cls-hooked';
// import { Transactional } from 'typeorm-transactional';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionLogEntity } from '../entities/tansaction-log.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionLogRepository: TransactionLogRepository,
    private readonly customerService: CustomerService,
  ) {}

  // @Transactional()
  async createTransaction(createTransactionDto: DefaultCreateTransactionDto, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;

    const customer = await this.customerService.findOneById(createTransactionDto.customer_id, manager);
    if (!customer) throw new BadRequestException('customer not found cuy!');

    const createTransaction = repository.create({
      ...createTransactionDto,
      customer_id: customer.id,
      transaction_status_id: TransactionStatusEnum.PENDING,
    });

    return repository.save(createTransaction);
  }

  // @Transactional()
  async completedTransaction(transactionId: string, createByUserId?: number, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;

    const transaction = await repository.findOne({ where: { id: transactionId  }})
    if(!transaction) throw new BadRequestException('transaction not found!');

    console.log("=======================")
    console.log({transaction})
    const lastLogTransaction = await this.transactionLogRepository.findOneByTransactionLogId(transaction.last_transaction_log_id, manager);
    
    console.log({lastLogTransaction})
    console.log("=======================")
    await repository.update(transaction.id, {
      transaction_status_id: TransactionStatusEnum.SUCCESS,
      last_transaction_log_id: lastLogTransaction?.id,
    });

    return this.transactionLogRepository.createTransaction({
          customer_id: transaction.customer_id,
          customer_account_number: transaction.customer_account_number,
          amount: transaction.amount,
          last_balance: lastLogTransaction?.present_balance,
          present_balance: lastLogTransaction?.present_balance.add(transaction.amount),
          transaction_type_id: transaction.transaction_type_id,
          last_transaction_id: transaction.last_transaction_id,
          last_transaction_log_id: lastLogTransaction?.id,
          transaction_id: transaction.id,
          bank_id: transaction.bank_id,
          created_by: createByUserId,
    });

  }

  async completedBulkTransaction(transactionIds: string[], userPayload?: IJwtPayload) {
    const transactionList = await this.transactionRepository.findBy({id: In(transactionIds)})
    if(!transactionList.length) return;

    const newTransactionLogs = [];
    for (const transaction of transactionList) {
      const lastLogTransaction = await this.transactionLogRepository.findOne({ where: {
        last_transaction_log_id: transaction.last_transaction_log_id
      }});
  
      await this.transactionRepository.update(transaction.id, {
        transaction_status_id: TransactionStatusEnum.SUCCESS,
        last_transaction_log_id: lastLogTransaction.id,
        updated_by: userPayload.id,
      });
  
      const newTransactionLog = this.transactionLogRepository.create({
        customer_id: transaction.customer_id,
        customer_account_number: transaction.customer_account_number,
        amount: transaction.amount,
        last_balance: lastLogTransaction.present_balance,
        present_balance: lastLogTransaction.present_balance.add(transaction.amount),
        transaction_type_id: transaction.transaction_type_id,
        last_transaction_id: transaction.last_transaction_id,
        last_transaction_log_id: lastLogTransaction.id,
        transaction_id: transaction.id,
        bank_id: transaction.bank_id,
        created_by: userPayload.id,
      });

      newTransactionLogs.push(newTransactionLog);
    }

    return await this.transactionLogRepository.save(newTransactionLogs);
  }

  async cancleTransaction(transactionId: string, userPayload?: IJwtPayload){
    const transaction = await this.transactionRepository.findOne({ where: {id: transactionId} })
    if(!transaction) throw new BadRequestException('transaction not found!');

    return this.transactionRepository.update(transaction.id, {
      transaction_status_id: TransactionStatusEnum.FAILED,
      updated_by: userPayload.id,
    });
  }

  async cancleBulkTransaction(transactionIds: string[], userPayload?: IJwtPayload){
    const transactionList = await this.transactionRepository.findBy({id: In(transactionIds)})
    if(!transactionList.length) return;

    const updatedTransactionIds = transactionList.map((transaction) => transaction.id);
    return this.transactionRepository.update(updatedTransactionIds, {
      transaction_status_id: TransactionStatusEnum.FAILED,
      updated_by: userPayload.id,
    });
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
