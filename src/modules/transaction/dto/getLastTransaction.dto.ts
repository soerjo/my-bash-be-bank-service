import { IsDate, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { TransactionTypeEnum } from "../../../common/constant/transaction-type.constant";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsRangeDate } from "../../../common/validation/isRangeDate.validation";
import { Type } from "class-transformer";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class GetLastTransactionDto {

  @ApiProperty()
  @IsString()
  private_number: string;

  @ApiProperty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(TransactionTypeEnum, { each: true })
  @Type(() => Number)
  @ApiPropertyOptional()
  transaction_types?: TransactionTypeEnum[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_date?: Date;

  
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsRangeDate('start_date', 7)
  end_date?: Date;
}