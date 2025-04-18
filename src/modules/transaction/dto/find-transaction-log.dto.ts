import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';
import { IsRangeDate } from '../../../common/validation/isRangeDate.validation';
import { TransactionTypeEnum } from '../../../common/constant/transaction-type.constant';
import { TransactionStatusEnum } from '../../../common/constant/transaction-status.constant';

export class GetTransactionLogDto {
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

//   @IsOptional()
  @IsEnum(TransactionTypeEnum)
  @Type(() => Number)
  @ApiProperty({ 
    enum: TransactionTypeEnum, 
    description: `
    Transaction type
    1. Deposit
    2. Withdraw
    ` 
  })
  transaction_type_id?: TransactionTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bank_id?: number;
}

export class FindTransactionLogDto extends IntersectionType(PaginationDto, GetTransactionLogDto) {
  @IsOptional()
  @IsEnum(TransactionStatusEnum, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map((v) => Number(v)) : [Number(value)]))
  @ApiPropertyOptional({
    enum: TransactionStatusEnum,
    type: [Number],
    description: `
    Transaction status
    1. Pending
    2. Success
    3. Failed
    `,
  })
  transaction_status?: TransactionStatusEnum[];
}
