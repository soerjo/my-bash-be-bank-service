import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controller/transaction.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService]
})
export class TransactionModule {}
