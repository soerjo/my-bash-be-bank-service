import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controller/transaction.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { CustomerModule } from '../customer/customer.module';
import { TransactionDetailRepository } from './repositories/transaction-detail.repository';
import { TransactionLogRepository } from './repositories/transaction-log.repository';
import { TransactionLogService } from './services/transaction-log.service';
import { TransactionDetailService } from './services/transaction-detail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CustomerModule,
  ],
  controllers: [
    TransactionController,
  ],
  providers: [
    TransactionService,
    TransactionLogService,
    TransactionDetailService,
    TransactionRepository,
    TransactionDetailRepository,
    TransactionLogRepository
  ],
  exports: [
    TransactionService,
    TransactionService,
    TransactionLogService,
    TransactionDetailService,
  ]
})
export class TransactionModule {}
