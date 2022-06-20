import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty({
        message: 'Category cannot be empty'
    })
    name: string

    @ApiProperty()
    description: string
}