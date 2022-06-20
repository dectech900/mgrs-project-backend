import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({
    message: 'Token cannot be empty',
  })
  token: string;

  @IsNotEmpty({
    message: 'New Password cannot be empty',
  })
  newPassword: string;

  @IsNotEmpty({
    message: 'Confirm password cannot be empty',
  })
  confirmPassword: string;
}
