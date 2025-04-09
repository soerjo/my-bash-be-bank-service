import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetBalanceDto {
    @IsString()
    @ApiProperty()
    private_account_number: string;

    @IsString()
    @ApiProperty()
    password: string;

}