import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { TransactionTypeEnum } from "../../../common/constant/transaction-type.constant";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsRangeDate } from "../../../common/validation/isRangeDate.validation";
import { Type } from "class-transformer";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class GetLastTransactionDto extends PaginationDto {

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

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  start_date?: Date;

  
  @IsDateString()
  @IsOptional()
  // @IsGreaderDate('start_date')
  @IsRangeDate('start_date', 7)
  @ApiPropertyOptional()
  end_date?: Date;

  // @IsString()
  // @IsOptional()
  // @ApiPropertyOptional()
  // transaction_id?: string;
}