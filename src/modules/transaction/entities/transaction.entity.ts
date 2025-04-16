import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { HistoryEntityAbstract } from "../../../common/abstract/history-entity.abstract";
import { TransactionStatusEntity } from "./transaction-status.entity";
import { TransactionTypeEntity } from "./transaction-type.entity";
import Decimal from "decimal.js";
import { BankEntity } from "../../../modules/bank/entities/bank.entity";

@Entity({ name: 'transaction', schema: 'bank' })
export class TransactionEntity extends HistoryEntityAbstract {
    @Column()
    customer_id: number;

    @Column()
    customer_account_number: string;

    @Column({
        default: 0, 
        type: 'decimal',
        precision: 18,
        scale: 4,
        transformer: {
          to: (value: Decimal | string | number): string => {
            return new Decimal(value ?? 0).toFixed(4, Decimal.ROUND_HALF_UP);
          },
          from: (value: string): Decimal => {
            return new Decimal(value ?? 0);
          },
        },
    })
    amount: Decimal; // total amount of price

    @Column({
      default: 0, 
      type: 'decimal',
      precision: 18,
      scale: 4,
      transformer: {
        to: (value: Decimal | string | number): string => {
          return new Decimal(value ?? 0).toFixed(4, Decimal.ROUND_HALF_UP);
        },
        from: (value: string): Decimal => {
          return new Decimal(value ?? 0);
        },
      },
    })
    system_fee_percent: Decimal; // total amount of price

    @Column({
      default: 0, 
      type: 'decimal',
      precision: 18,
      scale: 4,
      transformer: {
        to: (value: Decimal | string | number): string => {
          return new Decimal(value ?? 0).toFixed(4, Decimal.ROUND_HALF_UP);
        },
        from: (value: string): Decimal => {
          return new Decimal(value ?? 0);
        },
      },
    })
    system_fee_amount: Decimal; // total amount of price

    @Column({
      default: 0, 
      type: 'decimal',
      precision: 18,
      scale: 4,
      transformer: {
        to: (value: Decimal | string | number): string => {
          return new Decimal(value ?? 0).toFixed(4, Decimal.ROUND_HALF_UP);
        },
        from: (value: string): Decimal => {
          return new Decimal(value ?? 0);
        },
      },
    })
    final_amount: Decimal; // total amount of price
      
    @Column()
    message: string;

    @Column()
    transaction_type_id: number; // 1: deposit, 2: withdraw

    @Column()
    transaction_status_id: number; // 1: pending, 2: success, 3: failed

    @Column({nullable: true})
    last_transaction_id?: string;

    @Column({nullable: true})
    last_transaction_log_id?: string;

    @Column({nullable: true})
    bank_id?: number;

    @ManyToOne(() => TransactionStatusEntity)
    @JoinColumn({ name: 'transaction_status_id', referencedColumnName: 'transaction_status_id' })
    transactionStatus: TransactionStatusEntity;

    @ManyToOne(() => TransactionTypeEntity)
    @JoinColumn({ name: 'transaction_type_id', referencedColumnName: 'transaction_type_id' })
    transactionType: TransactionTypeEntity;

    @ManyToOne(() => BankEntity)
    @JoinColumn({ name: 'bank_id', referencedColumnName: 'id' })
    bank: BankEntity;

}