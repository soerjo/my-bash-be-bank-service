import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { HistoryEntityAbstract } from "../../../common/abstract/history-entity.abstract";
import { TransactionStatusEntity } from "./transaction-status.entity";
import { TransactionTypeEntity } from "./transaction-type.entity";
import Decimal from "decimal.js";

@Entity({ name: 'transaction', schema: 'bank' })
export class TransactionEntity extends HistoryEntityAbstract {
    @Column()
    customer_id: number;

    @Column({nullable: true})
    bank_id?: number;

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
    amount: Decimal;

    @Column()
    transaction_type_id: number; // 1: deposit, 2: withdraw, 3: transfer

    @Column()
    message: string;

    @Column({nullable: true})
    reference_id?: number; // refrence to warehouse-service transaction id

    @Column()
    transaction_status_id: number; // 1: pending, 2: success, 3: failed

    @Column({nullable: true})
    last_transaction_id?: string;

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
    balance_before?: Decimal;

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
    balance_after?: Decimal;

    @ManyToOne(() => TransactionStatusEntity)
    @JoinColumn({ name: 'transaction_status_id', referencedColumnName: 'transaction_status_id'  })
    transactionStatus: TransactionStatusEntity;

    @ManyToOne(() => TransactionTypeEntity)
    @JoinColumn({ name: 'transaction_type_id', referencedColumnName: 'transaction_type_id'  })
    transactionType: TransactionTypeEntity;
}