import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { TransactionLogEntity } from "../entities/tansaction-log.entity";
import { CreateTransactionLogDto } from "../dto/create-transactino-log.dto";

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

      // createTransaction() {
      //   const newTransactionLog = this.repositoryTrxLog.create({
      //     customer_id: transaction.customer_id,
      //     customer_account_number: transaction.customer_account_number,
      //     amount: transaction.amount,
      //     last_balance: lastLogTransaction?.present_balance,
      //     present_balance: lastLogTransaction?.present_balance.add(transaction.amount),
      //     transaction_type_id: transaction.transaction_type_id,
      //     last_transaction_id: transaction.last_transaction_id,
      //     last_transaction_log_id: lastLogTransaction?.id,
      //     transaction_id: transaction.id,
      //     bank_id: transaction.bank_id,
      //     created_by: createByUserId,
      //   })

      //   return repositoryTrxLog.save(newTransactionLog);
      // }
}