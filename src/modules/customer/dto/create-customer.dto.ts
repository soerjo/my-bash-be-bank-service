import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    
    last_transaction_id: string;

    balance: number;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    user_id: number;

    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional()
    private_account_number: string;

    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional()
    public_account_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    identity_number: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    photo_url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    province: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    regency: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    district: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    village: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    postal_code: string;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;
}
