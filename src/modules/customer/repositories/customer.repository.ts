import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, EntityManager, Repository } from "typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { FindCustomerDto } from "../dto/find-customer.dto";
import { IJwtPayload } from "../../../common/interface/jwt-payload.interface";
import { decrypt, staticDecrypt, staticEncrypt } from "../../../utils/encrypt.util";
import Decimal from "decimal.js";

@Injectable()
export class CustomerRepository extends Repository<CustomerEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(CustomerEntity, dataSource.createEntityManager());
    }

    findOneByUserId(userId: number, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(CustomerEntity) : this;
        return repo.findOne({ where: { user_id: userId } });
    }

    findOneByPrivateAccount(privateAccountNumber: string, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(CustomerEntity) : this;
        return repo.findOne({ where: { private_account_number: privateAccountNumber } });
    }

    findOneByPublicAccount(publicAccountNumber: string, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(CustomerEntity) : this;
        return repo.findOne({ where: { private_account_number: publicAccountNumber } });
    }

    async findAll(dto: FindCustomerDto, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(CustomerEntity) : this;
        const queryBuilder = repo.createQueryBuilder('customer');
        queryBuilder.select([
          'customer.id as id',
          'customer.user_id as user_id',
          'customer.private_account_number as private_account_number',
          'customer.public_account_number as public_account_number',
          'customer.full_name as full_name',
          'customer.name as name',
          'customer.identity_number as identity_number',
          'customer.phone as phone',
          'customer.province as province',
          'customer.regency as regency',
          'customer.district as district',
          'customer.village as village',
          'customer.address as address',
          'customer.postal_code as postal_code',
        ]);

        if(dto?.bank_id) {
          queryBuilder.andWhere('customer.bank_id = :bank_id', { bank_id: dto.bank_id });
        } 
        
        if(dto?.name) {
          queryBuilder.andWhere('customer.name ILIKE :name OR customer.full_name ILIKE :name', { name: `%${dto.name}%` });
        }
    
        if(dto?.identity_number) {
          queryBuilder.andWhere('customer.identity_number = :identity_number', { identity_number: staticEncrypt(dto.identity_number)  });
        }

        if(dto?.public_account_number) {
          queryBuilder.andWhere('customer.public_account_number = :public_account_number', { public_account_number: dto.public_account_number });
        }

        
        // if(dto?.address) {
        //   queryBuilder.where(
        //     new Brackets(qb => {
        //       qb.where('customer.province ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('customer.regency ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('customer.district ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('customer.village ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('customer.address ILIKE :address', { address: `%${dto.address}%` })
        //         .orWhere('customer.postal_code ILIKE :address', { address: `%${dto.address}%` });
        //     }),
        //   )
        // }

        queryBuilder.orderBy('customer.created_at', 'DESC')
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
          // full_name: staticDecrypt(data.full_name),
          // name: staticDecrypt(data.name),
          identity_number: staticDecrypt(data.identity_number),
          province: decrypt(data.province),
          regency: decrypt(data.regency),
          village: decrypt(data.village),
          district: decrypt(data.district),
          address: decrypt(data.address),
          postal_code: decrypt(data.postal_code),
          phone: decrypt(data.phone),
        }))
        
        return { data: processedData, meta}
      }
}