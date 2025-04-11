import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
import { MongooseCustomerService } from '../../mongoose-customer/services/mongoose-customer.service';
import { CustomerService } from '../../../../modules/customer/services/customer.service';
import { DataSource } from 'typeorm';
import { TransactionService } from '../../../../modules/transaction/services/transaction.service';
import Decimal from 'decimal.js';
import { TransactionStatusEnum } from '../../../../common/constant/transaction-status.constant';
import { TransactionTypeEnum } from '../../../../common/constant/transaction-type.constant';

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

  private iteration = 1;
  private failedIntegration: any[] = [];
  async sync(nextPage = 1) {
    let { data: dataVar, totalPages, page } = await this.mongooseCustomerService.findAll(nextPage);

    for (let index = 0; index < dataVar.length; index++) {
      await this.dataSource.transaction(async (manager) => {
        if(!dataVar[index]?.accountNumber) {
          this.failedIntegration.push(dataVar[index]);
          return;
        }
        const existCustomer = await this.customerService.findOneByPublicAccountNumber(dataVar[index]?.accountNumber);
        if (existCustomer) {
          this.failedIntegration.push(dataVar[index]);
          return;
        }
        

        // create customer account
        const customer = await this.customerService.create(
          {
            public_account_number: dataVar[index]?.accountNumber,
            full_name: dataVar[index].fullName,
            name: dataVar[index].username,
            password: dataVar[index]?.accountNumber.slice(0,6),
            phone: dataVar[index]?.phone,
            province: dataVar[index]?.address[0].province,
            regency: dataVar[index]?.address[0].city,
            district: dataVar[index]?.address[0].region,
            village: dataVar[index]?.address[0].region,
            address: dataVar[index]?.address[0].street,
            postal_code: dataVar[index]?.address[0].postalCode,
          },
          manager,
        );

        // generate transaction to init balance
        const transaction = await this.transactionService.create(
          {
            customer_id: customer.id,
            customer_account_number: customer.public_account_number,
            amount: new Decimal(dataVar[index].balance),
            transaction_type_id: TransactionTypeEnum.DEPOSIT,
            message: 'Initial Balance',
            transaction_status_id: TransactionStatusEnum.SUCCESS,
            balance_after: new Decimal(dataVar[index].balance),
          },
          manager,
        );

        customer.last_transaction_id = transaction.id;
        customer.balance = new Decimal(dataVar[index].balance);
        await this.customerService.update(customer, manager);
      }).catch((error) => {
        console.error(error);
        if(error instanceof BadRequestException) throw new BadRequestException(error);
        throw new Error('Error while syncing');
      });
      
      console.log('iteration => ', this.iteration ++)
    }
    
    if (page == totalPages) return {failedIntegration: this.failedIntegration};

    return this.sync(page + 1);
  }
}
