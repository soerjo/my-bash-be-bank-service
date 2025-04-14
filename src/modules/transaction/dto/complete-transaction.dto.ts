import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class UpdateTransactionStatusDto {
        @IsUUID('all', { each: true })
        @ApiProperty({ type: [String] })
        transaction_id: string[];
}