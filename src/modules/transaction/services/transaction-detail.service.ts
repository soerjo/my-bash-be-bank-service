import { Injectable } from '@nestjs/common';
import { IJwtPayload } from '../../../common/interface/jwt-payload.interface';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { TransactionDetailRepository } from '../repositories/transaction-detail.repository';

@Injectable()
export class TransactionDetailService {
  constructor(
    private readonly transactionDetailRepository: TransactionDetailRepository,
    private readonly customerService: CustomerService,
  ) {}

  async create(createDto: any) {

  }

  findAll(findDto: any, userPayload?: IJwtPayload) {
    return this.transactionDetailRepository.findAndCount({take: 10, skip: 0});
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
