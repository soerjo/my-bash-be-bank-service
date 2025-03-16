import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    user_id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    temp_password: string;
}