import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { FindCustomerDto } from "../dto/find-customer.dto";
import { IJwtPayload } from "../../../common/interface/jwt-payload.interface";
import { decrypt } from "../../../utils/encrypt.util";

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

    async findAll(dto: FindCustomerDto, userPayload: IJwtPayload, manager?: EntityManager) {
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
          'customer.balance as balance',
        ])
    
        // if(![RoleEnum.SUPER_ADMIN, RoleEnum.SYSTEM_ADMIN].includes(userPayload.role_id)) {
        //   queryBuilder.andWhere('user.bank_id = :bank_id', { bank_id: userPayload.bank_id });
        // }
    
        // if(dto.username) {
        //   queryBuilder.andWhere('user.username ilike :username', { username: `%${dto.username}%` });
        // }
    
        // if(dto.email) {
        //   queryBuilder.andWhere('user.email ilike :email', { email: `%${dto.email}%` });
        // }
    
        // if(dto.role_id) {
        //   queryBuilder.andWhere('user.role_id = :role_id', { role_id: dto.role_id });
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
          balance: data.balance ? parseFloat(data.balance) : 0,
          full_name: data.full_name ? decrypt(data.full_name) : '-',
          name: data.name ? decrypt(data.name) : '-',
          identity_number: data.identity_number ? decrypt(data.identity_number) : '-',
          province: data.province ? decrypt(data.province) : '-',
          regency: data.regency ? decrypt(data.regency) : '-',
          district: data.district ? decrypt(data.district) : '-',
          village: data.village ? decrypt(data.village) : '-',
          address: data.address ? decrypt(data.address) : '-',
          postal_code: data.postal_code ? decrypt(data.postal_code) : '-',
          phone: data.phone ? decrypt(data.phone) : '-',
        }))
        
        return { data: processedData, meta}
      }
}