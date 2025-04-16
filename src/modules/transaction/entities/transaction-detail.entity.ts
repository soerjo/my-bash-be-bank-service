import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TransactionStatusEntity } from "./transaction-status.entity";
import { TransactionTypeEntity } from "./transaction-type.entity";
import Decimal from "decimal.js";
import { BankEntity } from "../../../modules/bank/entities/bank.entity";
import { TransactionEntity } from "./transaction.entity";
import { HistoryEntityAbstract } from "../../../common/abstract/history-entity.abstract";

@Entity({ name: 'transaction-detail', schema: 'bank' })
export class TransactionDetailEntity extends HistoryEntityAbstract {
  @Column({ nullable: true })
  trx_id?: string;

  @Column()
  transaction_id: string;
      
  @Column()
  store_id: number;

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
  store_price: Decimal; // hasil dari harga - (harga * fee_percent)

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
  final_price?: Decimal;

  @Column()
  category_id?: number;

  @Column()
  category_name: string;

  @Column()
  category_code: string;

  @Column()
  unit_id: number;

  @Column()
  unit_name: string;

  @Column()
  unit_code: string;

  @Column()
  transaction_type_id: number; // 1: deposit, 2: withdraw

  @Column()
  transaction_status_id: number; // 1: pending, 2: success, 3: failed

  @Column({nullable: true})
  bank_id: number;

  @Column({nullable: true})
  warehouse_id: number;

  @ManyToOne(() => TransactionStatusEntity)
  @JoinColumn({ name: 'transaction_status_id', referencedColumnName: 'transaction_status_id'  })
  transactionStatus: TransactionStatusEntity;

  @ManyToOne(() => TransactionTypeEntity)
  @JoinColumn({ name: 'transaction_type_id', referencedColumnName: 'transaction_type_id'  })
  transactionType: TransactionTypeEntity;

  @ManyToOne(() => BankEntity)
  @JoinColumn({ name: 'bank_id', referencedColumnName: 'id'  })
  warehouse: BankEntity;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transaction_id', referencedColumnName: 'id'  })
  transaction: TransactionEntity;
}
