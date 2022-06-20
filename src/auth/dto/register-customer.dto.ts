import {
  IsEmail,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  NotEquals,
  Equals,
  IsDefined,
} from 'class-validator';
// import { USER_TYPE } from '../../types/types';

export class RegisterCustomerDto {
  @IsNotEmpty({
    message: 'First name cannot be empty',
  })
  first_name: string;

  @IsNotEmpty({ message: 'Last name cannot be empty' })
  last_name: string;

  @IsNotEmpty({
    message: 'Email cannot be empty',
  })
  @IsEmail()
  email: string;

  phone_number?: string;

  username?: string;

  is_account_active?: boolean;

  @IsNotEmpty({
    message: 'User Type cannot be empty',
  })


  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;


  @IsNotEmpty({ message: 'You must accept our terms & privacy policy' })
  @Equals(true, {
    message: 'You must accept our terms & privacy policy',
  })
  @IsBoolean()
  accept_privacy_policy: boolean;

  

  chosen_plan?: string;
}
