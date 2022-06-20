import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class UpdateCategoryDto {
    @ApiProperty()
    @IsNotEmpty({
        message: 'Category cannot be empty'
    })
    name: string

    @ApiProperty()
    description: string
}