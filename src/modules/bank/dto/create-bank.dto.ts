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

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    postal_code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional()
    owner_id: number;
}
