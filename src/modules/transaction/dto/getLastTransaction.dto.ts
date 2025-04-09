import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { TransactionTypeEnum } from "../../../common/constant/transaction-type.constant";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsRangeDate } from "src/common/validation/isRangeDate.validation";
import { IsGreaderDate } from "src/common/validation/isGreaderDate.validation";
import { Type } from "class-transformer";

export class GetLastTransactionDto {
  @IsOptional()
  @IsEnum(TransactionTypeEnum, { each: true })
  @Type(() => Number)
  @ApiPropertyOptional()
  transaction_types?: TransactionTypeEnum[];

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  start_transaction_date?: Date;
  
  @IsDateString()
  @IsOptional()
  @IsGreaderDate('start_transaction_date')
  @IsRangeDate('start_transaction_date', 7)
  @ApiPropertyOptional()
  end_transaction_date?: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  transaction_id?: string;
}