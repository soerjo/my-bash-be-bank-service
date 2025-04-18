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
import { subDays } from 'date-fns';

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

    const system_fee_percent = 0; // it should be fetch systems service;
    const system_fee_amount = new Decimal(system_fee_percent).mul(createTransactionDto.amount).div(100);
    const final_amount = new Decimal(createTransactionDto.amount).minus(system_fee_amount);

    const createTransaction = repository.create({
      ...createTransactionDto,
      customer_id: customer.id,
      amount: createTransactionDto.amount,
      system_fee_percent: system_fee_percent,
      system_fee_amount: system_fee_amount,
      final_amount: final_amount,
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
        last_transaction_log_id: lastLogTransaction?.id,
        updated_by: userPayload.id,
      });
    
      const newTransactionLog = this.transactionLogRepository.create({
        customer_id: transaction.customer_id,
        customer_account_number: transaction.customer_account_number,
        // value: transaction.amount,
        amount: transaction.amount,
        fee_amount: transaction.system_fee_amount,
        final_amount: transaction.final_amount,
        last_balance: lastLogTransaction?.present_balance,
        present_balance: lastLogTransaction?.present_balance.plus(transaction.amount),
        transaction_type_id: transaction.transaction_type_id,
        last_transaction_id: transaction.last_transaction_id,
        last_transaction_log_id: lastLogTransaction?.id,
        transaction_id: transaction.id,
        bank_id: transaction.bank_id,
        created_by: userPayload.id,
      });

      newTransactionLogs.push(newTransactionLog);
    }

    // do sync to warehouse-service
    // await this.warehouseService.completeTransactionWarehouse(
    //   transactionList.map((transaction) => transaction.id),
    //   userPayload.token,
    // );
    
    return await this.transactionLogRepository.save(newTransactionLogs);
  }

  
  @Transactional()
  async completedBulkTransactionDetail(transactionDetailIds: string[], userPayload?: IJwtPayload) {
    const transactionDetailList = await this.transactionDetailRepository.findBy({id: In(transactionDetailIds)})
    if(!transactionDetailList.length) return;

    transactionDetailList.forEach((transaction) => {
      transaction.transaction_status_id = TransactionStatusEnum.SUCCESS;
      transaction.updated_by = userPayload.id;
    })

    await this.transactionDetailRepository.save(transactionDetailList);

    let transactionIds = transactionDetailList.map((transaction) => transaction.transaction_id);
    transactionIds = [...new Set(transactionIds)];
    for (const transactionId of transactionIds) {
      await this.completedTransactionFromDetail(transactionId, userPayload);
    }
  }

  @Transactional()
  async cancelBulkTransactionDetail(transactionDetailIds: string[], userPayload?: IJwtPayload) {
    const transactionDetailList = await this.transactionDetailRepository.findBy({id: In(transactionDetailIds)})
    if(!transactionDetailList.length) return;

    transactionDetailList.forEach((transaction) => {
      transaction.transaction_status_id = TransactionStatusEnum.FAILED;
      transaction.updated_by = userPayload.id;
    })

    await this.transactionDetailRepository.save(transactionDetailList);

    const transactionIds = transactionDetailList.map((transaction) => transaction.transaction_id);
    await this.transactionRepository.update(transactionIds, {
      transaction_status_id: TransactionStatusEnum.FAILED,
      updated_by: userPayload.id,
    });
  }

  async completedTransactionFromDetail(transactionId: string, userPayload: IJwtPayload){
    const transaction = await this.transactionRepository.findOne({ where: { id: transactionId  }})
    if(!transaction) throw new BadRequestException('transaction not found!');

    const transacionDetail = await this.transactionDetailRepository.find({ where: { transaction_id: transactionId }})
    const isAllComplete = transacionDetail.every((transaction) => transaction.transaction_status_id === TransactionStatusEnum.SUCCESS);
    if(!isAllComplete) return;

    const lastLogTransaction = await this.transactionLogRepository.findOne({ where: {
      customer_id: transaction.customer_id,
    }, order: {
      created_at: 'DESC'
    }});

    await this.transactionRepository.update(transaction.id, {
      transaction_status_id: TransactionStatusEnum.SUCCESS,
      last_transaction_log_id: lastLogTransaction?.id,
      updated_by: userPayload.id,
    });
  
    const newTransactionLog = this.transactionLogRepository.create({
      customer_id: transaction.customer_id,
      customer_account_number: transaction.customer_account_number,
      amount: transaction.amount,
      fee_amount: transaction.system_fee_amount,
      final_amount: transaction.final_amount,
      last_balance: lastLogTransaction?.present_balance,
      present_balance: lastLogTransaction?.present_balance.plus(transaction.amount),
      transaction_type_id: transaction.transaction_type_id,
      last_transaction_id: transaction.last_transaction_id,
      last_transaction_log_id: lastLogTransaction?.id,
      transaction_id: transaction.id,
      bank_id: transaction.bank_id,
      created_by: userPayload.id,
    });

    await this.transactionLogRepository.save(newTransactionLog);
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
    // await this.warehouseService.cancleTransactionWarehouse({
    //   transaction_bank_id: updatedTransactionIds,
    // }, userPayload.token);
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
    dto.start_date = dto.start_date ?? subDays(new Date(), 7);
    dto.end_date = dto.end_date ?? new Date();

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

  async getBestCustomer(dto: FindTransactionDto) {
    dto.start_date = dto.start_date ?? subDays(new Date(), 7);
    dto.end_date = dto.end_date ?? new Date();
    const { data: transaction } = await this.transactionLogRepository.getBestTransactionCustomer(dto);
    const customer = await this.customerService.getByIds(transaction.map((transaction) => transaction.customer_id));
    
    // return transaction
    return transaction.map(data => {
      const customerTransaction = customer.find((customer) => customer.id === data.customer_id);

      return {
        id: data.customer_id,
        full_name: customerTransaction.full_name,
        name: customerTransaction.name,
        amount: data?.total_balance,
      }
    })
  }

  getTotalBalance(dto: FindTransactionDto) {
    dto.start_date = dto.start_date ?? subDays(new Date(), 7);
    dto.end_date = dto.end_date ?? new Date();
    return this.transactionLogRepository.getTotalBalance(dto)
  }

  getTotalBalanceBank(dto: FindTransactionDto) {
    return this.transactionLogRepository.getTotalBalanceBank(dto)
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
      let storeTotalPrice = new Decimal(detail_transaction.amount).mul(store.price)
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
    const transaction = await this.createTransaction({
      amount: new Decimal(amount),
      customer_account_number: customer.public_account_number,
      customer_id: customer.id,
      message: dto.message,
      transaction_type_id: TransactionTypeEnum.DEPOSIT,
      last_transaction_id: lastTransaction?.id,
      bank_id: userPayload.bank_id,
    })

    // const transaction = await this.transactionRepository.save(createtransaction);

    const createNewDetailTransaction = await this.transactionDetailRepository.save(transactionDetailList.map((detail) =>
      this.transactionDetailRepository.create({
        ...detail,
        transaction_id: transaction.id,
      })
    ));

    // do sync to warehouse-service
    await this.warehouseService.createTransactionWarehouse({
      message: dto.message,
      trx_id: transaction.id,
      transactions: createNewDetailTransaction.map((detail) => ({
        transaction_bank_id: detail.id,
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
