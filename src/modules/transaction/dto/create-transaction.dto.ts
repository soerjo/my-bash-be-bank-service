import Decimal from "decimal.js";

export class CreateTransactionDto {
    customer_id: number;
    bank_id?: number;
    customer_account_number: string;
    amount: Decimal;
    transaction_type_id: number;
    message: string;
    reference_id?: number;
    transaction_status_id: number;
    last_transaction_id?: string;
    balance_before?: Decimal;
    balance_after?: Decimal;
}
