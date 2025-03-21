import { Module } from '@nestjs/common';
import { BankService } from './services/bank.service';
import { BankController } from './controller/bank.controller';
import { BankRepository } from './repositories/bank.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './entities/bank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankEntity])
  ],
  controllers: [BankController],
  providers: [BankService, BankRepository],
})
export class BankModule {}
