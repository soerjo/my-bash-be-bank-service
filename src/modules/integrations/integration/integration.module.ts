import { Module } from '@nestjs/common';
import { IntegrationService } from './services/integration.service';
import { IntegrationController } from './controllers/integration.controller';
import { CustomerModule } from '../../../modules/customer/customer.module';
import { TransactionModule } from '../../../modules/transaction/transaction.module';
import { MongooseCustomerModule } from '../mongoose-customer/mongoose-customer.module';

@Module({
  imports: [CustomerModule, TransactionModule, MongooseCustomerModule],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}
