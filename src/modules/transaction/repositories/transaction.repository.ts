import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, EntityManager, Repository } from "typeorm";
// import { CustomerEntity } from "../entities/customer.entity";
// import { FindCustomerDto } from "../dto/find-customer.dto";
import { IJwtPayload } from "../../../common/interface/jwt-payload.interface";
import { decrypt } from "../../../utils/encrypt.util";
import { TransactionEntity } from "../entities/transaction.entity";
import { FindTransactionDto } from "../dto/find-transaction.dto";
import Decimal from "decimal.js";

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(TransactionEntity, dataSource.createEntityManager());
    }

    // findOneByUserId(userId: number, manager?: EntityManager) {
    //     const repo = manager ? manager.getRepository(TransactionEntity) : this;
    //     return repo.findOne({ where: { user_id: userId } });
    // }

    // findOneByPrivateAccount(privateAccountNumber: string, manager?: EntityManager) {
    //     const repo = manager ? manager.getRepository(TransactionEntity) : this;
    //     return repo.findOne({ where: { private_account_number: privateAccountNumber } });
    // }

    // findOneByPublicAccount(publicAccountNumber: string, manager?: EntityManager) {
    //     const repo = manager ? manager.getRepository(TransactionEntity) : this;
    //     return repo.findOne({ where: { private_account_number: publicAccountNumber } });
    // }

    async findAll(dto: FindTransactionDto, userPayload: IJwtPayload, manager?: EntityManager) {
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
          "transaction.message as message",
          "transaction.reference_id as reference_id",
          "transaction.transaction_type_id as transaction_type_id",
          "transaction_type.name as transaction_type_name",
          "transaction.transaction_status_id as transaction_status_id",
          "transaction_status.name as transacion_status_name",
          "transaction.last_transaction_id as last_transaction_id",
          "transaction.balance_before as balance_before",
          "transaction.balance_after as balance_after",
          "transaction.created_at as created_at",
        ]);
        
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
    
        console.log({itemCount, rawData})
        const processedData = rawData.map(data => ({
          ...data, 
          amount: new Decimal(data.amount),
          balance_before: new Decimal(data.balance_before),
          balance_after: new Decimal(data.balance_after),
        }))
        
        return { data: processedData, meta}
      }
}