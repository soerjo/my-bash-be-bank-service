import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsRangeDate } from '../../../common/validation/isRangeDate.validation';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class GetTopCustomerDto {
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
  @IsRangeDate('start_date', 30)
  end_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bank_id?: number;
}

export class GetTopCustomerPageDto extends IntersectionType(PaginationDto, GetTopCustomerDto) {}
