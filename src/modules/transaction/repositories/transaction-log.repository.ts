import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { TransactionLogEntity } from "../entities/tansaction-log.entity";
import { CreateTransactionLogDto } from "../dto/create-transactino-log.dto";
import Decimal from "decimal.js";
import { FindTransactionLogDto } from "../dto/find-transaction-log.dto";
import { TransactionTypeEnum } from "../../../common/constant/transaction-type.constant";
import { GetTopCustomerPageDto } from "../dto/get-top-customer.dto";
import { GetBankBalanceDto } from "../dto/get-bank-balance.dto";

@Injectable()
export class TransactionLogRepository extends Repository<TransactionLogEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(TransactionLogEntity, dataSource.createEntityManager());
    }

    async createTransaction(dto: CreateTransactionLogDto, manager?: EntityManager): Promise<TransactionLogEntity> {
      const repoTransaction = manager ? manager.getRepository(TransactionLogEntity) : this;
  
      const createTransaction = repoTransaction.create({
              customer_id: dto.customer_id,
              customer_account_number: dto.customer_account_number,
              amount: dto.amount,
              last_balance: dto?.last_balance,
              present_balance: dto?.present_balance,
              transaction_type_id: dto.transaction_type_id,
              last_transaction_id: dto.last_transaction_id,
              last_transaction_log_id: dto?.last_transaction_log_id,
              transaction_id: dto.transaction_id,
              bank_id: dto.bank_id,
              created_by: dto.created_by,
      });
      
      return repoTransaction.save(createTransaction);
    }

    findOneByTransactionLogId(TransactionLogId: string, manager?: EntityManager) {
      const repository = manager ? manager.getRepository(TransactionLogEntity) : this;

      if (!TransactionLogId) return null;
      return repository.findOne({ where: { last_transaction_log_id: TransactionLogId }});
    }

    async getTotalBalance(dto: FindTransactionLogDto): Promise<{total_balance: number}> {
      const queryBuilder = this.createQueryBuilder('transaction_log');
      queryBuilder.select('SUM(transaction_log.amount)', 'total_balance');
      // queryBuilder.addSelect('SUM(transaction_log.present_balance)', 'total_balance');


      dto.bank_id && queryBuilder.where('transaction_log.bank_id = :bank_id', { bank_id: dto.bank_id });
  
      if(dto?.private_account_number) {
        queryBuilder.andWhere('transaction_log.private_account_number = :private_account_number', { private_account_number: dto.private_account_number });
      }
      
      if(dto?.customer_account_number) {
        queryBuilder.andWhere('transaction_log.customer_account_number = :customer_account_number', { customer_account_number: dto.customer_account_number });
      }
  
      if(dto?.start_date) {
        const startDate = new Date(dto.start_date);
        startDate.setHours(0, 0, 0, 0);
        queryBuilder.andWhere('transaction_log.created_at >= :start_date', { start_date: startDate });
      }
  
      if(dto?.end_date) {
        const endDate = new Date(dto.end_date);
        endDate.setHours(23, 59, 59, 999);
        queryBuilder.andWhere('transaction_log.created_at <= :end_date', { end_date: endDate });
      }
  
      if(dto.transaction_type_id) {
        // dto.transaction_type_id = dto.transaction_type_id ?? TransactionTypeEnum.DEPOSIT;
        queryBuilder.andWhere('transaction_log.transaction_type_id = :transaction_type_id', { transaction_type_id: dto.transaction_type_id });
      }
  
      const result = await queryBuilder.getRawOne();
      
      return { 
        total_balance: new Decimal(result?.total_balance ?? 0).toNumber(),
        // total_balance_in_bank: new Decimal(result?.total_balance_in_bank ?? 0).toNumber(),
      }
    }

    async getTotalBalanceBank(dto: GetBankBalanceDto): Promise<any> {
      const queryBuilder = this.dataSource.createQueryBuilder()
      queryBuilder.select('SUM(sub.present_balance)', 'total_latest_amount');
      queryBuilder.from(subQuery => {
        subQuery.select('DISTINCT ON (transaction_log.customer_id) *');
        subQuery.from(TransactionLogEntity, 'transaction_log');

        dto.bank_id && subQuery.where('transaction_log.bank_id = :bank_id', { bank_id: dto.bank_id });        

        subQuery.orderBy('transaction_log.customer_id');
        subQuery.addOrderBy('transaction_log.created_at', 'DESC');

        return subQuery;
      }, 'sub');

      const result = await queryBuilder.getRawOne();
      return {
        total_latest_amount: new Decimal(result?.total_latest_amount ?? 0).toNumber(),
      }
    }

    async getBestTransactionCustomer(dto: GetTopCustomerPageDto){
      const queryBuilder = this.createQueryBuilder('transaction_log');
      queryBuilder.select('SUM(transaction_log.amount)', 'total_balance');
      queryBuilder.addSelect('transaction_log.customer_id', 'customer_id');

      dto.bank_id && queryBuilder.where('transaction_log.bank_id = :bank_id', { bank_id: dto.bank_id });        
      
      if(dto?.start_date) {
        const startDate = new Date(dto.start_date);
        startDate.setHours(0, 0, 0, 0);
        queryBuilder.andWhere('transaction_log.created_at >= :start_date', { start_date: startDate });
      }
  
      if(dto?.end_date) {
        const endDate = new Date(dto.end_date);
        endDate.setHours(23, 59, 59, 999);
        queryBuilder.andWhere('transaction_log.created_at <= :end_date', { end_date: endDate });
      }
  
      queryBuilder.andWhere('transaction_log.transaction_type_id = :transaction_type_id', { transaction_type_id: TransactionTypeEnum.DEPOSIT });
  
      queryBuilder.groupBy('transaction_log.customer_id')
      queryBuilder.orderBy('total_balance', 'DESC')
      queryBuilder.offset((dto.page - 1) * dto.take).limit(dto.take)
    
      const queryItemCount = queryBuilder.getCount()
      const queryUser = queryBuilder.getRawMany()
      const [rawData, itemCount] = await Promise.all([queryUser, queryItemCount])
  
      const meta = {
        page: dto?.page,
        offset: dto?.take,
        itemCount,
        pageCount: Math.ceil(itemCount / dto?.take) ? Math.ceil(itemCount / dto?.take) : 0,
      };
  
      const processedData = rawData.map(data => ({
        ...data, 
        total_balance: new Decimal(data.total_balance ?? 0).toNumber(),
        // fee_amount: new Decimal(data.fee_amount).toNumber(),
        // final_amount: new Decimal(data.final_amount).toNumber(),
      }))
      
      return { data: processedData, meta}
    }
}