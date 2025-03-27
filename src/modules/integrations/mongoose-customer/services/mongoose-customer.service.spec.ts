import { Test, TestingModule } from '@nestjs/testing';
import { MongooseCustomerService } from './mongoose-customer.service';

describe('MongooseCustomerService', () => {
  let service: MongooseCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseCustomerService],
    }).compile();

    service = module.get<MongooseCustomerService>(MongooseCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
