import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber } from "class-validator";
import Decimal from "decimal.js";

export class WithdrawCashDto {
    @ApiProperty()
    @IsInt()
    customer_id: number;

    @ApiProperty()
    @IsNumber()
    amount: number;
}

export class DefaultWithdrawCashDto {
    customer_id: number
    amount: Decimal
    message: string
    bank_id?: number
}