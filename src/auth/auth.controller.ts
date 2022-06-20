import {
  Body,
  Controller,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../decorators/user.decorator';
import { User as IUser, } from '../users/schemas/users.schema';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IJWTResponse } from 'src/types/types';
import { ChangeEmailPasswordDto, ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async logIn(@User() user: IUser & { _id: string }): Promise<any> {
    return this.authService.login(user);
  }

  @Put('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @User() user: IJWTResponse,
    @Body(new ValidationPipe({transform: true})) body:ChangePasswordDto
  ):Promise<IUser>{
    return this.authService.changePassword(user, body)
  }
  @Put('/change-email-password')
  @UseGuards(JwtAuthGuard)
  async changeEmailPassword(
    @User() user: IJWTResponse,
    @Body(new ValidationPipe({transform: true})) body:ChangeEmailPasswordDto
  ):Promise<IUser>{
    return this.authService.changeEmailPassword(user, body)
  }

  // @Post('/register')
  // async register(
  //   @Body(new ValidationPipe({ transform: true })) body: RegisterCustomerDto,
  // ): Promise<any> {
  //   return this.authService.register(body);
  // }

  @Post('/forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe({ transform: true })) body: ForgotPasswordDto,
  ): Promise<any> {
    return this.authService.forgotPassword(body);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body(new ValidationPipe({ transform: true })) body: ResetPasswordDto,
  ): Promise<any> {
    return this.authService.resetPassword(body);
  }
}
