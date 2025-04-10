import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class FindTransactionDto extends PaginationDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    customer_account_number?: string;
}