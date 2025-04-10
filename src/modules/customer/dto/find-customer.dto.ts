import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class FindCustomerDto extends PaginationDto {
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    identity_number?: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public_account_number?: string;
    
    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsString()
    // address?: string;

}