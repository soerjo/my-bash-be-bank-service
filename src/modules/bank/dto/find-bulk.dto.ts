import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Min } from "class-validator";

export class FindBulkDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true }) // Ensures every element is an integer
    @Min(1, { each: true }) // Optional: Ensures each ID is at least 1
    @ApiProperty({isArray: true, type: 'number', description: 'Array of bank IDs'})
    ids: number[];
}