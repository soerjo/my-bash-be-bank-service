import { BadRequestException, Injectable } from "@nestjs/common";
import { BankEntity } from "../entities/bank.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, In, Repository } from "typeorm";
import { CreateBankDto } from "../dto/create-bank.dto";
import { bankGenerateCode } from "../../../utils/bank-code-generator.utils";
import { IJwtPayload } from "../../../common/interface/jwt-payload.interface";
import { decrypt } from "../../../utils/encrypt.util";
// import { BaseRepository } from "typeorm-transactional-cls-hooked";

@Injectable()
export class BankRepository extends Repository<BankEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BankEntity, dataSource.createEntityManager());
  }
  async createBankAccount (dto: CreateBankDto, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(BankEntity) : this;
    const lastBankAccount = await repository.find({order: {id: 'DESC'}, take: 1});
    const lastId = lastBankAccount.length ? lastBankAccount[0].id : 0;
    const code = bankGenerateCode(lastId)
    const bank = repository.create({...dto, code});

    return repository.save(bank);
  }

  async updateData (updateDto: Partial<BankEntity>, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(BankEntity) : this;
    const existingBank = await repository.findOne({ where: { id: updateDto.id } });
    return repository.save({...existingBank, ...updateDto});
  }

  async findAll(dto: any, userPayload: IJwtPayload) {
    const queryBuilder = this.createQueryBuilder('bank');
    queryBuilder.select([
      "bank.id as id",
      "bank.name as name",
      "bank.code as code",
      "bank.email as email",
      "bank.province as province",
      "bank.regency as regency",
      "bank.district as district",
      "bank.village as village",
      "bank.address as address",
      "bank.postal_code as postal_code",
      "bank.phone as phone",
      "bank.owner_id as owner_id",
    ]);

    // if(dto.username) {
    //   queryBuilder.andWhere('user.username ilike :username', { username: `%${dto.username}%` });
    // }

    // if(dto.email) {
    //   queryBuilder.andWhere('user.email ilike :email', { email: `%${dto.email}%` });
    // }

    // if(dto.role_id) {
    //   queryBuilder.andWhere('user.role_id = :role_id', { role_id: dto.role_id });
    // }

    queryBuilder.orderBy('bank.created_at', 'DESC')
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
      // name: decrypt(data.name),
      // code: decrypt(data.code),
      province: decrypt(data.province),
      regency: decrypt(data.regency),
      district: decrypt(data.district),
      village: decrypt(data.village),
      address: decrypt(data.address),
      postal_code: decrypt(data.postal_code),
      phone: decrypt(data.phone),
      // owner_id: decrypt(data.owner_id),
    }))
    
    return { data: processedData, meta}
  }

  findOneByIds(ids: number[], manager?: EntityManager) {
    const repository = manager ? manager.getRepository(BankEntity) : this;
    return repository.find({ where: { id: In(ids) } });
  }

  findOneByOwnerId(ownerId: number, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(BankEntity) : this;
    return repository.findOne({ where: { owner_id: ownerId } });
  }

  findOneByName(name: string, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(BankEntity) : this;
    return repository.findOne({ where: { name } })
  }

  findOneByCode(code: string, manager?: EntityManager) {
    const repository = manager ? manager.getRepository(BankEntity) : this;
    return repository.findOne({ where: { code } })
  }


}