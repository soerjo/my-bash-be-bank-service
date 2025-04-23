import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controller/customer.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [forwardRef(() => TransactionModule)],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService]
})
export class CustomerModule {}
