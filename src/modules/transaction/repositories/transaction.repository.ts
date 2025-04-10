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
        queryBuilder.leftJoin('transaction.transactionStatus', 'transaction_status');
        queryBuilder.leftJoin('transaction.transactionType', 'transaction_type');
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
        ]);
        
        // if(dto?.name) {
        //   queryBuilder.andWhere('transaction.name ILIKE :name OR transaction.full_name ILIKE :name', { name: `%${dto.name}%` });
        // }
    
        // if(dto?.identity_number) {
        //   queryBuilder.andWhere('transaction.identity_number = :identity_number', { identity_number: dto.identity_number });
        // }

        // if(dto?.public_account_number) {
        //   queryBuilder.andWhere('transaction.public_account_number = :public_account_number', { public_account_number: dto.public_account_number });
        // }

        
        // if(dto?.address) {
        //   queryBuilder.where(
        //     new Brackets(qb => {
        //       qb.where('transaction.province ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('transaction.regency ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('transaction.district ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('transaction.village ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('transaction.address ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('transaction.postal_code ILIKE :address', { address: `%${dto.address}%` });
        //     }),
        //   )
        // }

        queryBuilder.orderBy('transaction.created_at', 'DESC')
        queryBuilder.skip((dto.page - 1) * dto.take).take(dto.take)
      
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
          amount: new Decimal(data.amount),
          balance_before: new Decimal(data.balance_before),
          balance_after: new Decimal(data.balance_after),
        }))
        
        return { data: processedData, meta}
      }
}