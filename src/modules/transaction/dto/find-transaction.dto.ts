import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { Transform, Type } from "class-transformer";
import { IsRangeDate } from "../../../common/validation/isRangeDate.validation";
import { TransactionTypeEnum } from "../../../common/constant/transaction-type.constant";

export class FindTransactionDto extends PaginationDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    customer_account_number?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    private_account_number?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    start_date?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    // @IsGreaderDate('start_date')
    @IsRangeDate('start_date', 7)
    end_date?: Date;

    @IsOptional()
    @IsEnum(TransactionTypeEnum, { each: true })
    @Transform(({ value }) =>
        Array.isArray(value)
          ? value.map((v) => Number(v))
          : [Number(value)],
      )
    @ApiPropertyOptional({ type: [Number] })
    transaction_types?: TransactionTypeEnum[];

    bank_id?: number;
}