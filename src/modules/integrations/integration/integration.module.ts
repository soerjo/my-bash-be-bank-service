import { Module } from '@nestjs/common';
import { IntegrationService } from './services/integration.service';
import { IntegrationController } from './controllers/integration.controller';
import { CustomerModule } from '../../../modules/customer/customer.module';
import { TransactionModule } from '../../../modules/transaction/transaction.module';
import { MongooseCustomerModule } from '../mongoose-customer/mongoose-customer.module';
import { IntegrationRepositories } from './repositories/integration.repository';

@Module({
  imports: [CustomerModule, TransactionModule, MongooseCustomerModule],
  controllers: [IntegrationController],
  providers: [IntegrationService, IntegrationRepositories],
})
export class IntegrationModule {}
