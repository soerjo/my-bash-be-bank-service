import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controller/customer.controller';
import { CustomerRepository } from './repositories/customer.repository';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService]
})
export class CustomerModule {}
