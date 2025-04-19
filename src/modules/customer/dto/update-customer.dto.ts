import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
        @IsOptional()
        @IsString()
        @ApiPropertyOptional()
        full_name?: string;
    
        @IsOptional()
        @IsString()
        @ApiPropertyOptional()
        name?: string;
    
        @IsOptional()
        @IsNumberString()
        @ApiPropertyOptional()
        identity_number?: string;
    
        @IsOptional()
        @IsString()
        @ApiPropertyOptional()
        province?: string;
    
        @IsOptional()
        @IsString()
        @ApiProperty()
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
}
