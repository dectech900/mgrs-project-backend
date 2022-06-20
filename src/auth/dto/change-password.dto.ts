import { IsEmail } from "class-validator"

export class ChangePasswordDto{
    password: string
    confirmPassword: string
}

export class ChangeEmailPasswordDto{
    password: string
    confirmPassword: string
    @IsEmail({
        message: 'Provide a valid email address'
    })
    email?: string
}