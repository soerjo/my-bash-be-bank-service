import { BadRequestException, Injectable } from "@nestjs/common";
import { BankEntity } from "../entities/bank.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateBankDto } from "../dto/create-bank.dto";
import { bankGenerateCode } from "src/utils/bank-code-generator.utils";
import { IJwtPayload } from "../../../common/interface/jwt-payload.interface";

@Injectable()
export class BankRepository {
    constructor(
        @InjectRepository(BankEntity)
        private bankRepository: Repository<BankEntity>,
    ){}

    async createBankAccount (dto: CreateBankDto) {
        const lastBankAccount = await this.bankRepository.find({order: {id: 'DESC'}, take: 1});
        const lastId = lastBankAccount.length ? lastBankAccount[0].id : 0;
        const code = bankGenerateCode(lastId)
        const bank = this.bankRepository.create({...dto, code});
        return this.bankRepository.save(bank);
    }

    async findAll(dto: any, userPayload: IJwtPayload) {
        const queryBuilder = this.bankRepository.createQueryBuilder('bank');

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
        const [itemCount, data] = await Promise.all([queryItemCount, queryUser])
    
        const meta = {
          page: dto?.page,
          offset: dto?.take,
          itemCount,
          pageCount: Math.ceil(itemCount / dto?.take) ? Math.ceil(itemCount / dto?.take) : 0,
        };
    
        return { data, meta}
      }
    
      findOneByIds(ids: number[]) {
        return this.bankRepository.find({ where: { id: In(ids) } });
      }

      findOneById(id: number) {
        return this.bankRepository.find({ where: { id } });
      }

      findOneByOwnerId(ownerId: number) {
        return this.bankRepository.findOne({ where: { owner_id: ownerId } });
      }
    
      findOneByName(name: string) {
        return this.bankRepository.findOne({ where: { name } })
      }

      findOneByCode(code: string) {
        return this.bankRepository.findOne({ where: { code } })
      }

      async update(id: number, dto: any) {
        const existUser = await this.findOneById(id)
        if(!existUser) throw new BadRequestException('User not found');
    
        const updateUserData = this.bankRepository.create({
            ...existUser,
            ...dto
        })
        
        return this.bankRepository.save(updateUserData)
      }
    
      remove(id: number) {
        const existUser = this.findOneById(id)
        if(!existUser) throw new BadRequestException('User not found');
    
        return this.bankRepository.softDelete(id)
      }
}