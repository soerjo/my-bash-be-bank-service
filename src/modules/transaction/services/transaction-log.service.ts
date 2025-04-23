import { Injectable } from '@nestjs/common';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { TransactionLogRepository } from '../repositories/transaction-log.repository';
import Decimal from 'decimal.js';

@Injectable()
export class TransactionLogService {
  constructor(
    private readonly transactionLogRepository: TransactionLogRepository,
  ) {}

  async create(createDto: any) {

  }

  findAll(findDto: any, userPayload?: IJwtPayload) {
    return this.transactionLogRepository.findAndCount({take: 10, skip: 0});
  }

  async getByUserId(userId:number) {
    const logs = await this.transactionLogRepository.findOne({ where: { customer_id: userId }, order: { created_at: 'DESC' }});
    const payloadKeys = Object.keys(logs.payload);
    return {
      ...logs,
      present_balance: new Decimal(logs.present_balance ?? 0).toNumber(),
      payload: payloadKeys.map(keys=> ({
        ...logs.payload[keys],
        amount: new Decimal(logs.payload[keys].amount ?? 0).toNumber(),
      }) )
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateDto: any) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
