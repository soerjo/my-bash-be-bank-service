export class DetailDepositItemDto {
    store_id: number;
    amount: number;
}

export class DepositItemDto {
    store_id: number;
    amount: number;
    transaction_bank_id: string;
    message: string;
    trx_id?: string;
}

export class DepositItemBulkDto {
    transaction_bank_id: string;
    message: string;
    trx_id?: string;
    transactions: DetailDepositItemDto[];
}