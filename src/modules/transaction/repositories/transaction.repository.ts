import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { IJwtPayload } from "../../../common/interface/jwt-payload.interface";
import { TransactionEntity } from "../entities/transaction.entity";
import { FindTransactionDto } from "../dto/find-transaction.dto";
import Decimal from "decimal.js";
import { TransactionStatusEnum } from "../../../common/constant/transaction-status.constant";
import { DefaultCreateTransactionDto } from "../dto/create-transaction.dto";


@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(TransactionEntity, dataSource.createEntityManager());
    }

  async createTransaction(dto: DefaultCreateTransactionDto, manager?: EntityManager): Promise<TransactionEntity> {
    const repoTransaction = manager ? manager.getRepository(TransactionEntity) : this;
    const createTransaction = repoTransaction.create({
      customer_id: dto.customer_id,
      customer_account_number: dto.customer_account_number,
      amount: dto.amount,
      message: dto.message,
      transaction_type_id: dto.transaction_type_id,
      last_transaction_id: dto.last_transaction_id,
      bank_id: dto.bank_id,
      transaction_status_id: TransactionStatusEnum.PENDING,
    });
    
    return repoTransaction.save(createTransaction);
  }

  async findAll(dto: FindTransactionDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(TransactionEntity) : this;
    const queryBuilder = repo.createQueryBuilder('transaction');
    queryBuilder.leftJoin('transaction.transactionStatus', 'transaction_status', 'transaction_status.deleted_at IS NULL');
    queryBuilder.leftJoin('transaction.transactionType', 'transaction_type', 'transaction_type.deleted_at IS NULL');
    queryBuilder.select([
      "transaction.id as id",
      "transaction.customer_id as customer_id",
      "transaction.bank_id as bank_id",
      "transaction.customer_account_number as customer_account_number",
      "transaction.amount as amount",
      "transaction.system_fee_amount as fee_amount",
      "transaction.final_amount as final_amount",
      "transaction.message as message",
      "transaction.transaction_type_id as transaction_type_id",
      "transaction_type.name as transaction_type_name",
      "transaction.transaction_status_id as transaction_status_id",
      "transaction_status.name as transacion_status_name",
      "transaction.last_transaction_id as last_transaction_id",
      "transaction.created_at as created_at",
    ]);

    if(dto?.bank_id) {
      queryBuilder.andWhere('transaction.bank_id = :bank_id', { bank_id: dto.bank_id });
    }

    if(dto?.private_account_number) {
      queryBuilder.andWhere('transaction.private_account_number = :private_account_number', { private_account_number: dto.private_account_number });
    }
    
    if(dto?.customer_account_number) {
      queryBuilder.andWhere('transaction.customer_account_number = :customer_account_number', { customer_account_number: dto.customer_account_number });
    }

    if(dto?.start_date) {
      const startDate = new Date(dto.start_date);
      startDate.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('transaction.created_at >= :start_date', { start_date: startDate });
    }

    if(dto?.end_date) {
      const endDate = new Date(dto.end_date);
      endDate.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('transaction.created_at <= :end_date', { end_date: endDate });
    }

    if(dto.transaction_types) {
      queryBuilder.andWhere('transaction.transaction_type_id IN (:...transaction_types)', { transaction_types: dto.transaction_types });
    }

    if(dto.transaction_status) {
      queryBuilder.andWhere('transaction.transaction_status_id IN (:...transaction_status)', { transaction_status: dto.transaction_status });
    }

    queryBuilder.orderBy('transaction.created_at', 'DESC')
    queryBuilder.offset((dto.page - 1) * dto.take).limit(dto.take)
  
    const queryItemCount = queryBuilder.getCount()
    const queryUser = queryBuilder.getRawMany()
    const [itemCount, rawData] = await Promise.all([queryItemCount, queryUser])

    const meta = {
      page: dto?.page,
      offset: dto?.take,
      itemCount,
      pageCount: Math.ceil(itemCount / dto?.take) ? Math.ceil(itemCount / dto?.take) : 0,
    };

    const processedData = rawData.map(data => ({
      ...data, 
      amount: new Decimal(data.amount).toNumber(),
      fee_amount: new Decimal(data.fee_amount).toNumber(),
      final_amount: new Decimal(data.final_amount).toNumber(),
    }))
    
    return { data: processedData, meta}
  }


}