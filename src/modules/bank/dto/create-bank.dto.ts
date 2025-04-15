import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Transform(({ value }) => value.trim().toLowerCase())
    @Length(4,50)
    // should add validation that the name is not contain some dangerous word
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

    trx_id?: string;
}
