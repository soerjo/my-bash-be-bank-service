import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    
    last_transaction_id?: string;

    balance?: number;

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

    @IsOptional()
    @IsString()
    @ApiProperty()
    full_name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    name?: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty()
    identity_number?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    photo_url?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    province?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    regency?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    district?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    village?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    address?: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty()
    postal_code?: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty()
    phone?: string;

    created_by?: number;

    bank_id?: number;
}
