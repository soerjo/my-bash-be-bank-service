import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString } from "class-validator";
import Decimal from "decimal.js";

export class CreateTransactionCashDto {
    @ApiProperty()
    @IsInt()
    customer_id: number;

    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsNumber()
    amount: number;
}

export class DefaultCreateTransactionCashDto {
    customer_id: number
    amount: Decimal
    message: string
    bank_id?: number
}