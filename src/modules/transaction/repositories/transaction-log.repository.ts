import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { TransactionLogEntity } from "../entities/tansaction-log.entity";
import { CreateTransactionLogDto } from "../dto/create-transactino-log.dto";
import { TransactionTypeEnum } from "../../../common/constant/transaction-type.constant";
import Decimal from "decimal.js";

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

      async getTotalBalance(bank_id: number){
        const query = this.createQueryBuilder('transaction_log');
        query.select('SUM(transaction_log.present_balance)', 'total_balance');
        query.where('transaction_log.bank_id = :bank_id', { bank_id });
        query.andWhere('transaction_log.transaction_type_id = :transaction_type_id', { transaction_type_id: TransactionTypeEnum.DEPOSIT });

        const {total_balance} = await query.getRawOne();
        return new Decimal(total_balance).toNumber();
      }
}