import { IsNotEmpty } from 'class-validator';

export class AuthenticateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
