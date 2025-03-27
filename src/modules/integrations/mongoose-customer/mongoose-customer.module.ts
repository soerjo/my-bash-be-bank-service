import { Module } from '@nestjs/common';
import { MongooseCustomerService } from './services/mongoose-customer.service';
import { MongooseCustomerController } from './controllers/mongoose-customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema, Customer } from './entities/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema}]),
  ],
  controllers: [MongooseCustomerController],
  providers: [MongooseCustomerService],
  exports: [MongooseCustomerService],
})
export class MongooseCustomerModule {}
