import Decimal from "decimal.js"

export class CreateTransactionLogDto {
    customer_id: number
    customer_account_number: string
    amount: Decimal
    last_balance: Decimal
    present_balance: Decimal
    transaction_type_id: number
    last_transaction_id: string
    last_transaction_log_id: string
    transaction_id: string
    bank_id: number
    created_by: number
}