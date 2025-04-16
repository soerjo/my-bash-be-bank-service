import { Injectable } from '@nestjs/common';
import { MongooseCustomerService } from '../../mongoose-customer/services/mongoose-customer.service';
import { CustomerService } from '../../../../modules/customer/services/customer.service';
import { DataSource } from 'typeorm';
import Decimal from 'decimal.js';
import { TransactionTypeEnum } from '../../../../common/constant/transaction-type.constant';
import {Customer} from '../../mongoose-customer/entities/customer.schema'
import { TransactionService } from '../../../../modules/transaction/services/transaction.service';
import { IntegrationRepositories } from '../repositories/integration.repository';
import { Transactional } from 'typeorm-transactional';
import { IJwtPayload } from '../../../../common/interface/jwt-payload.interface';
// import { Transactional } from 'typeorm-transactional-cls-hooked';


@Injectable()
export class IntegrationService {
  constructor(
    private readonly integrationRepository: IntegrationRepositories,
    private readonly mongooseCustomerService: MongooseCustomerService,
    private readonly customerService: CustomerService,
    private readonly transactionService: TransactionService,
    private readonly dataSource: DataSource,
    // private readonly transactionRepositories: TransactionRepository,
  ) {}  

  async sync(nextPage = 1, iteration = 0, bankSampahId: string, userPayload: IJwtPayload) {
    let { data: dataVar, totalPages, page } = await this.mongooseCustomerService.findAll(nextPage, 50, bankSampahId);
    
    for (let index = 0; index < dataVar.length; index++) {
      try {
        await this.integration(dataVar[index], userPayload);
        console.log('iteration => ', iteration ++);

      } catch (error) {
        console.log('error', error);
        await this.integrationRepository.save({
          account_number: dataVar[index]?.accountNumber,
          fullname: dataVar[index]?.fullName,
          balance: String(dataVar[index]?.balance),
          profile: {...dataVar[index]},
          error: error,
          error_message: error?.message,          
        });
      }

    }
    
    if (page == totalPages) return;
    
    return this.sync(page + 1, iteration, bankSampahId, userPayload);
    // return;
  }
  
  // @Transactional({propagation: Propagation.MANDATORY})
  @Transactional()
  async integration(dataVar: Customer, userPayload: IJwtPayload){
      if(!dataVar?.accountNumber) {
        throw new Error('Account number is not found!');
      }
      
      const existCustomer = await this.customerService.findOneByPublicAccountNumber(dataVar?.accountNumber);
      if (existCustomer) {
        throw new Error('Account number already exist!');
      }
      
      // await this.dataSource.transaction(async (manager) => {
      // create customer account
        const customer = await this.customerService.create(
          {
            public_account_number: dataVar?.accountNumber,
            full_name: dataVar.fullName,
            name: dataVar.username,
            password: dataVar.accountNumber.slice(0,6),
            phone: dataVar.phone,
            province: dataVar.address[0]?.province,
            regency: dataVar.address[0]?.city,
            district: dataVar.address[0]?.region,
            village: dataVar.address[0]?.region,
            address: dataVar.address[0]?.street,
            postal_code: dataVar.address[0]?.postalCode,
            bank_id: userPayload.bank_id,
          },
          // manager
        );
    
        // generate transaction to init balance
        const transaction = await this.transactionService.createTransaction(
          {
            customer_id: customer.id,
            customer_account_number: customer.public_account_number,
            amount: new Decimal(dataVar.balance),
            transaction_type_id: TransactionTypeEnum.DEPOSIT,
            message: 'Initial Balance',
            bank_id: userPayload.bank_id,
          },
          // manager
        );
  
        // completed transaction to init balance
        await this.transactionService.completedTransaction(
          transaction.id, 
          0, 
          // manager
        );
    }
}
