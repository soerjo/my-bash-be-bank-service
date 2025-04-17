export class DetailDepositItemDto {
    transaction_bank_id: string;
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
    message: string;
    trx_id?: string;
    transactions: DetailDepositItemDto[];
}