import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsString, ValidateNested } from "class-validator";
import Decimal from "decimal.js";
import { TransactionStatusEnum } from "../../../common/constant/transaction-status.constant";

export class CreateTransactionDetailDto {
        @ApiProperty()
        @IsInt()
        store_id?: number;

        @ApiProperty()
        @IsNumber()
        store_price: number;

        @ApiProperty()
        @IsNumber()
        store_amount: number;

        @ApiProperty()
        @IsNumber()
        store_total_price: number;

        @ApiProperty()
        @IsInt()
        category_id?: number;

        @ApiProperty()
        @IsString()
        category_name: string;

        @ApiProperty()
        @IsString()
        category_code: string;

        @ApiProperty()
        @IsString()
        category_description?: string;

        @ApiProperty()
        @IsInt()
        unit_id: number;

        @ApiProperty()
        @IsString()
        unit_name: string;

        @ApiProperty()
        @IsString()
        unit_code: string;

        @ApiProperty()
        @IsInt()
        bank_id: number;

        @ApiProperty()
        @IsInt()
        warehouse_id: number;
}

export class CreateTransactionDto {
    @ApiProperty()
    @IsInt()
    customer_id: number;

    // @ApiProperty()
    // @IsString()
    // customer_account_number: string;

    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty({ type: [CreateTransactionDetailDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTransactionDetailDto)
    detail_transaction: CreateTransactionDetailDto[];
}

export class DefaultCreateTransactionDto {
    customer_id: number
    customer_account_number: string
    amount: Decimal
    message: string
    transaction_type_id: number
    last_transaction_id?: string
    bank_id?: number
}
