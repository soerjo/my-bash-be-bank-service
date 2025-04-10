import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseService } from './warehouse.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('WarehouseService', () => {
  let service: WarehouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [WarehouseService],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getWarehouseByIds should return data', async () => {
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InJvb3RfYWRtaW4iLCJ1c2VybmFtZSI6InJvb3RfYWRtaW4iLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZV9pZCI6MCwiYmFua19pZCI6MCwiaXNfdGVtcF9wYXNzd29yZCI6ZmFsc2UsImlzX2VtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3NDQyODg4MzUsImV4cCI6MTc0NDMxNzYzNX0.Qc_ewyu-_ntofz1aCl4lFFeRWdF2Enxi8MJ6v9t2HrJ7xczGjQPuqTg989L4Z5L8wBfWPpkRvvnuA84PIRLCBb2-v0pZ77mMtzHM1YIvxyX7QaG8V1nvDUsdL0N9ldksfqfm8tMDWmRa8XCyyy1ZcjvPwnGU5C4z6D_rzLGYCPVyH2-LGLr0fKT1pK-aVGs1sqxEL79Y5c-yedhxNSUmcgb4YvYujjsqmTIKI3Lv7jIvdFWVTohioSLTj5I7sm_gzil4p2BzeavrtO4XBa_5ajlu2wj8QQbALpMT4fAN0Loswipx9z0dJ2ohd9kPVWNDEbUqbW9t4kuUnqpzXCkJdQ`
    const result = await service.getWarehouseByIds([1, 2], token);
    console.log({ result });
    expect(result).toBeDefined();
  });
});
