import { Injectable } from '@nestjs/common';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
import { MongooseCustomerService } from '../../mongoose-customer/services/mongoose-customer.service';
import { CustomerService } from '../../../../modules/customer/services/customer.service';
import { DataSource } from 'typeorm';
import { TransactionService } from '../../../../modules/transaction/services/transaction.service';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mongooseCustomerService: MongooseCustomerService,
    private readonly customerService: CustomerService,
    private readonly transactionService: TransactionService,
  ) {}
  create(createIntegrationDto: CreateIntegrationDto) {
    return 'This action adds a new integration';
  }

  findAll() {
    return `This action returns all integration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} integration`;
  }

  update(id: number, updateIntegrationDto: UpdateIntegrationDto) {
    return `This action updates a #${id} integration`;
  }

  remove(id: number) {
    return `This action removes a #${id} integration`;
  }

  async sync() {
    let { data: dataVar, totalPages, page } = await this.mongooseCustomerService.findAll();

    for (let index = 0; index < totalPages; index++) {
      // const element = array[index];

      for (let index = 0; index < dataVar.length; index++) {
        await this.dataSource.transaction(async (manager) => {
          console.log('iteration => ', index + 1)
          const existCustomer = await this.customerService.findOneByPublicAccountNumber(dataVar[index].accountNumber);
          if (existCustomer) {
            return; 
          }

          const customer = await this.customerService.create(
            {
              public_account_number: dataVar[index].accountNumber,
              full_name: dataVar[index].fullName,
              name: dataVar[index].username,
            },
            manager,
          );

          const transaction = await this.transactionService.create(
            {
              customer_id: customer.id,
              customer_account_number: customer.public_account_number,
              amount: dataVar[index].balance,
              transaction_type_id: 1,
              message: 'Initial Balance',
              transaction_status_id: 2,
              balance_after: dataVar[index].balance,
            },
            manager,
          );

          customer.last_transaction_id = transaction.id;
          customer.balance = dataVar[index].balance;
          await this.customerService.update(customer, manager);
        }).catch((error) => {
          console.error(error);
          throw new Error('Error while syncing');
        });
      }

      const { data } = await this.mongooseCustomerService.findAll(page + 1);
      dataVar = data;
    }
  }
}
