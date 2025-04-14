import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionTypeEntity } from "./transaction-type.entity";
import Decimal from "decimal.js";
import { TransactionEntity } from "./transaction.entity";
import { BankEntity } from "../../../modules/bank/entities/bank.entity";
import { CustomerEntity } from "../../../modules/customer/entities/customer.entity";

@Entity({ name: 'transaction-log', schema: 'bank' })
export class TransactionLogEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
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
    last_balance?: Decimal; // total amount of price

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
    present_balance?: Decimal; // total amount of price

    @Column()
    transaction_type_id: number; // 1: deposit, 2: withdraw

    @Column({nullable: true, unique: true})
    last_transaction_id?: string;

    @Column({nullable: true, unique: true})
    last_transaction_log_id?: string;

    @Column({nullable: true, unique: true})
    transaction_id?: string;

    @Column({nullable: true})
    bank_id?: number;

    @Column({ nullable: false, default: 0 })
    created_by: number;
    
    @CreateDateColumn()
    created_at: Date;
    
    @ManyToOne(() => TransactionTypeEntity)
    @JoinColumn({ name: 'transaction_type_id', referencedColumnName: 'transaction_type_id'  })
    transactionType: TransactionTypeEntity;
    
    @OneToOne(() => TransactionEntity)
    @JoinColumn({ name: 'transaction_id', referencedColumnName: 'id'  })
    transaction: TransactionEntity;
    
    @OneToOne(() => TransactionEntity)
    @JoinColumn({ name: 'last_transaction_id', referencedColumnName: 'id'  })
    lastTransaction: TransactionEntity;
    
    @OneToOne(() => TransactionLogEntity)
    @JoinColumn({ name: 'last_transaction_log_id', referencedColumnName: 'id'  })
    lastTransactionLog: TransactionLogEntity;
    
    @ManyToOne(() => BankEntity)
    @JoinColumn({ name: 'bank_id', referencedColumnName: 'id' })
    bank: BankEntity;
    
    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    custommer: CustomerEntity;
}