import {
  Injectable,
  Logger,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { User } from '../users/schemas/users.schema';
import { verifyPassword } from 'src/utils/helpers';
import { IJWTResponse } from 'src/types/types';
import {
  ChangeEmailPasswordDto,
  ChangePasswordDto,
} from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.authenticate(username);
    if (user) {
      if (verifyPassword(password, user?.password)) {
        return user;
      } else {
        throw new UnauthorizedException(null, 'Invalid credentials');
      }
    } else {
      throw new NotFoundException(null, 'Invalid credentials');
    }
  }

  async login(user: User & { _id: string }): Promise<any> {
    const payload = {
      email: user?.email,
      user_type: user?.user_type,
      sub: user?._id,
      staff_id: user?.staff_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user_type: user?.user_type,
      staff_id: user?.staff_id,
    };
  }

  // async register(customer: RegisterCustomerDto): Promise<any> {
  //   return this.userService.registerCustomer(customer);
  // }

  async forgotPassword(body: ForgotPasswordDto): Promise<any> {
    return this.userService.forgotCustomerPassword(body);
  }
 
  async resetPassword(
    body: ResetPasswordDto,
  ): Promise<any> {
    return this.userService.resetCustomerPassword(body);
  }

  async changePassword(
    user: IJWTResponse,
    body: ChangePasswordDto,
  ): Promise<User> {
    return this.userService.changePassword(user, body);
  }
  async changeEmailPassword(
    user: IJWTResponse,
    body: ChangeEmailPasswordDto,
  ): Promise<User> {
    return this.userService.changeEmailPassword(user, body);
  }
}
