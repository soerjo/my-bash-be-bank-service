import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    password: string;
    
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    user_id?: number;

    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional()
    private_account_number?: string;

    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional()
    public_account_number?: string;

    @IsString()
    @ApiProperty()
    full_name?: string;

    @IsString()
    @ApiProperty()
    name?: string;

    @IsString()
    @ApiProperty()
    email?: string;

    @IsOptional()
    @IsNumberString()
    @ApiPropertyOptional()
    identity_number?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    photo_url?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    province?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    regency?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    district?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    village?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    address?: string;

    @IsOptional()
    @IsNumberString()
    @ApiPropertyOptional()
    postal_code?: string;

    @IsOptional()
    @IsNumberString()
    @ApiPropertyOptional()
    phone?: string;

    created_by?: number;

    bank_id?: number;
}
