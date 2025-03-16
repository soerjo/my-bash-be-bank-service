import { Module } from '@nestjs/common';
import { BankService } from './services/bank.service';
import { BankController } from './controller/bank.controller';
import { BankRepository } from './repositories/bank.repository';

@Module({
  controllers: [BankController],
  providers: [BankService, BankRepository],
})
export class BankModule {}
