import { Column, Entity } from "typeorm";
import { HistoryEntityAbstract } from "../../../common/abstract/history-entity.abstract";

@Entity({ name: 'transaction', schema: 'bank' })
export class TransactionEntity extends HistoryEntityAbstract {
    @Column()
    customer_id: number;

    @Column()
    bank_id: number;

    @Column()
    customer_account_number: number;

    @Column()
    amount: number;

    @Column()
    transaction_type_id: number; // 1: deposit, 2: withdraw, 3: transfer

    @Column()
    message: string;

    @Column({nullable: true})
    reference_id: number; // refrence to warehouse-service transaction id

    @Column()
    transaction_status_id: number; // 1: pending, 2: success, 3: failed

    @Column()
    last_transaction_id: number;

    @Column()
    balance_before: number;

    @Column()
    balance_after: number;
}