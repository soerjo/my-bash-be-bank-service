// import { HistoryEntityAbstract } from "src/common/abstract/history-entity.abstract";
import { TransactionEntity } from "../entities/transaction.entity";

export class CreateTransactionDto {
    customer_id: number;
    bank_id?: number;
    customer_account_number: string;
    amount: number;
    transaction_type_id: number;
    message: string;
    reference_id?: number;
    transaction_status_id: number;
    last_transaction_id?: string;
    balance_before?: number;
    balance_after?: number;
}
