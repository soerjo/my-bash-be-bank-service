import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;  
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    province: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    regency: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    district: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    village: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    address: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    postal_code: string;

    @IsOptional()
    @ApiPropertyOptional()
    @IsString()
    phone: string;
}
