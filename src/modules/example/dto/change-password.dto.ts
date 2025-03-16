import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ example: 'new_password' })
    @IsString()
    @IsNotEmpty()
    new_password: string;
}