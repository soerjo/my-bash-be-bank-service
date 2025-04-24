import { ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsOptional, IsUUID } from "class-validator";

export class SyncStorePrice {
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('all',{each: true})
    transaction_bank_ids?: string[];
}