import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto, DefaultCreateTransactionDto } from '../dto/create-transaction.dto';
import { EntityManager, In } from 'typeorm';
import { FindTransactionDto } from '../dto/find-transaction.dto';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { GetLastTransactionDto } from '../dto/getLastTransaction.dto';
import { TransactionStatusEnum } from '../../../common/constant/transaction-status.constant';
import { TransactionLogRepository } from '../repositories/transaction-log.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionDetailRepository } from '../repositories/transaction-detail.repository';
import { CreateTransactionCashDto } from '../dto/create-transaction-cash.dto';
import { WithdrawCashDto } from '../dto/create-withdraw-cash.dto';
import { WarehouseService } from '../../../modules/warehouse/services/warehouse.service';
import { Transactional } from 'typeorm-transactional';
import Decimal from 'decimal.js';
import { TransactionTypeEnum } from '../../../common/constant/transaction-type.constant';
import { TransactionDetailEntity } from '../entities/transaction-detail.entity';
import { GetBalanceDto } from '../dto/get-balance.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionLogRepository: TransactionLogRepository,
    private readonly transactionDetailRepository: TransactionDetailRepository,
    private readonly customerService: CustomerService,
    private readonly warehouseService: WarehouseService,
  ) {}

  // @Transactional()
  async createTransaction(createTransactionDto: DefaultCreateTransactionDto,  manager?: EntityManager) {
    const repository = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;

    const customer = await this.customerService.findOneById(createTransactionDto.customer_id, manager);
    if (!customer) throw new BadRequestException('customer not found!');

    const createTransaction = repository.create({
      ...createTransactionDto,
      customer_id: customer.id,
      transaction_status_id: TransactionStatusEnum.PENDING,
      bank_id: createTransactionDto.bank_id,
    });

    return repository.save(createTransaction);
  }

  @Transactional()
  async completedTransaction(transactionId: string, createByUserId?: number, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(TransactionEntity) : this.transactionRepository;

    const transaction = await repository.findOne({ where: { id: transactionId  }})
    if(!transaction) throw new BadRequestException('transaction not found!');

    const lastLogTransaction = await this.transactionLogRepository.findOneByTransactionLogId(transaction.last_transaction_log_id, manager);
    
    await repository.update(transaction.id, {
      transaction_status_id: TransactionStatusEnum.SUCCESS,
      last_transaction_log_id: lastLogTransaction?.id,
    });

    return this.transactionLogRepository.createTransaction({
          customer_id: transaction.customer_id,
          customer_account_number: transaction.customer_account_number,
          amount: transaction.amount,
          last_balance: new Decimal(lastLogTransaction?.present_balance ?? 0),
          present_balance: new Decimal(lastLogTransaction?.present_balance ?? 0).plus(transaction.amount),
          transaction_type_id: transaction.transaction_type_id,
          last_transaction_id: transaction.last_transaction_id,
          last_transaction_log_id: lastLogTransaction?.id,
          transaction_id: transaction.id,
          bank_id: transaction.bank_id,
          created_by: createByUserId,
    });
  }

  @Transactional()
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
        present_balance: lastLogTransaction.present_balance.plus(transaction.amount),
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

  @Transactional()
  async cancleBulkTransaction(transactionIds: string[], userPayload?: IJwtPayload){
    const transactionList = await this.transactionRepository.findBy({id: In(transactionIds)})
    if(!transactionList.length) return;

    const updatedTransactionIds = transactionList.map((transaction) => transaction.id);
    await this.transactionRepository.update(updatedTransactionIds, {
      transaction_status_id: TransactionStatusEnum.FAILED,
      updated_by: userPayload.id,
    });

    // do sync to warehouse-service
    await this.warehouseService.cancleTransactionWarehouse({
      transaction_bank_id: updatedTransactionIds,
    }, userPayload.token);
  }

  async getLastTransaction(dto: GetLastTransactionDto) {
    const customer = await this.customerService.findOneByPrivateAccountNumber(dto.private_number, dto.password);
    if (!customer) throw new BadRequestException('private number and password not valid!');

    const {data} = await this.transactionRepository.findAll({
      ...dto,
      customer_account_number: customer.public_account_number,
      page: 1, 
      take: 10,
    });

    const transactionIds = data.map((transaction) => transaction.id);
    const transactionDetails = await this.transactionDetailRepository.findBy({transaction_id: In(transactionIds)});

    const processedData = data.map((transaction) => {
      const transactionDetail = transactionDetails.filter((detail) => detail.transaction_id === transaction.id);
      return {
        ...transaction,
        transaction_detail: transactionDetail,
      };
    });

    return processedData;
  }

  async findAll(dto: FindTransactionDto) {
    const {data, meta} = await this.transactionRepository.findAll(dto);
    const transactionIds = data.map((transaction) => transaction.id);
    const transactionDetails = await this.transactionDetailRepository.findBy({transaction_id: In(transactionIds)});

    const processedData = data.map((transaction) => {
      const transactionDetail = transactionDetails.filter((detail) => detail.transaction_id === transaction.id);
      return {
        ...transaction,
        transaction_detail: transactionDetail,
      };
    });

    return {
      data: processedData,
      meta,
    };
  }

  getTotalBalance(userPayload: IJwtPayload) {
    return this.transactionLogRepository.getTotalBalance(userPayload.bank_id)
  }

  getTotalTransaction(userPayload: IJwtPayload) {
    return this.transactionRepository.count({where: {bank_id: userPayload.bank_id, transaction_status_id: TransactionStatusEnum.SUCCESS}})
  }

  @Transactional()
  async depositThings(dto: CreateTransactionDto, userPayload: IJwtPayload) {
    //get costumer by account customer_id
    const customer = await this.customerService.findOneById(dto.customer_id);
    if (!customer) throw new BadRequestException('customer not found!');

    // get price product
    const storeIds = dto.detail_transaction.map((detail) => detail.store_id);
    const storeList = await this.warehouseService.getStoreByIds(storeIds, userPayload.token);

    // get price from warehouse
    let amount = new Decimal(0);
    let transactionDetailList: TransactionDetailEntity[] = [];
    for (const detail_transaction of dto.detail_transaction) {
      const store = storeList.find((store) => store.id === detail_transaction.store_id);
      if(!store) throw new BadRequestException(`store id:${detail_transaction.store_id} not found!`);
      const storeTotalPrice = new Decimal(detail_transaction.amount).mul(store.price)
      amount = storeTotalPrice.plus(amount);

      transactionDetailList.push(
        this.transactionDetailRepository.create({
          store_id: store.id,
          store_price: new Decimal(store.price),
          amount: new Decimal(detail_transaction.amount),
          final_price: storeTotalPrice,
          category_id: store.category.id,
          category_name: store.category.name,
          category_code: store.category.code,
          unit_id: store.category.unit.id,
          unit_name: store.category.unit.name,
          unit_code: store.category.unit.code,
          transaction_type_id: TransactionTypeEnum.DEPOSIT, // 1: deposit, 2: withdraw
          transaction_status_id: TransactionStatusEnum.PENDING, // 1: pending, 2: success, 3: failed
          bank_id: userPayload.bank_id,
          warehouse_id: userPayload.warehouse_id,
        })
      )
    }

    // create transaction
    const lastTransaction = await this.transactionRepository.findOne({where: {customer_id: customer.id}, order: {created_at: 'DESC'}});
    const createtransaction = await this.createTransaction({
      amount: new Decimal(amount),
      customer_account_number: customer.public_account_number,
      customer_id: customer.id,
      message: dto.message,
      transaction_type_id: TransactionTypeEnum.DEPOSIT,
      last_transaction_id: lastTransaction?.id,
      bank_id: userPayload.bank_id,
    })

    const transaction = await this.transactionRepository.save(createtransaction);

    const createNewDetailTransaction = transactionDetailList.map((detail) =>
      this.transactionDetailRepository.create({
        ...detail,
        transaction_id: transaction.id,
      })
    )

    // bulk create transaction detail
    await this.transactionDetailRepository.save(createNewDetailTransaction);

    // do sync to warehouse-service
    await this.warehouseService.createTransactionWarehouse({
      message: dto.message,
      trx_id: transaction.id,
      transaction_bank_id: transaction.id,
      transactions: transactionDetailList.map((detail) => ({
        store_id: detail.store_id,
        amount: detail.amount.toNumber(),
      })),
    }, userPayload.token);

    return transaction;
  }

  async depositCash(dto: CreateTransactionCashDto) {
    //get costumer by account customer_id

    // comulate total price

    // create transaction

  }

  async withdrawCash(dto: WithdrawCashDto) {
    //get costumer by account customer_id

    // comulate total price

    // create transaction

  }

  async getBalance(dto: GetBalanceDto) {
    const result = await this.customerService.findOneByPrivateAccountNumber(dto.private_account_number, dto.password);
    if(!result) throw new BadRequestException('Invalid private number or password');
    
    const transaction = await this.transactionLogRepository.findOne({
      where: {
        customer_account_number: result.public_account_number
      }, 
      order: {
        created_at: 'DESC'
      },
    })

    return {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      user_id: result.user_id,
      bank_id: result.bank_id,
      // private_account_number: result.private_account_number,
      public_account_number: result.public_account_number,
      full_name: result.full_name,
      name: result.name,
      photo_url: result.photo_url,
      balance: transaction.present_balance.toNumber(),
      // transaction,
    }
  }

}
