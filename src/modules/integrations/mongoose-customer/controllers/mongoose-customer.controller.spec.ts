import { Test, TestingModule } from '@nestjs/testing';
import { MongooseCustomerController } from './mongoose-customer.controller';
import { MongooseCustomerService } from '../services/mongoose-customer.service';

describe('MongooseCustomerController', () => {
  let controller: MongooseCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MongooseCustomerController],
      providers: [MongooseCustomerService],
    }).compile();

    controller = module.get<MongooseCustomerController>(MongooseCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
