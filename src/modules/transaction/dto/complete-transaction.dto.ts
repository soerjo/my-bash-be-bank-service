import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsUUID } from "class-validator";

export class UpdateTransactionStatusDto {
        @ApiProperty({ type: [String] })
        @IsArray()
        @ArrayMinSize(1)
        @IsUUID('all', { each: true })
        transaction_id: string[];
}