import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNumber, IsString, ValidateNested } from "class-validator";
import Decimal from "decimal.js";

export class CreateTransactionDetailDto {
    @ApiProperty()
    @IsInt()
    store_id?: number;

    @ApiProperty()
    @IsNumber()
    amount: number;
}

export class CreateTransactionDto {
    @ApiProperty()
    @IsInt()
    customer_id: number;

    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty({ type: [CreateTransactionDetailDto] })
    @IsArray()
    @ArrayMinSize(1)
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
