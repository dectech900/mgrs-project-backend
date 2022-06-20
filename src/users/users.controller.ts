import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IJWTResponse, IUploadFile } from 'src/types/types';
import { User } from './schemas/users.schema';
import { User as IUser } from '../decorators/user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsers(@UploadedFile() file: IUploadFile): Promise<any> {
    return await this.userService.uploadUsers(file);
  }

  @Get('/profile/me')
  @UseGuards(JwtAuthGuard)
  async me(@IUser() user: IJWTResponse): Promise<User> {
    return await this.userService.me(user);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }
  
  @Get('/jobs')
  async getUserJob():Promise<any>{
    return this.userService.getUserJob()
  }


  @Put('/profile/me')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @IUser() user: IJWTResponse,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(user, body);
  }

  @Post('/verify/:token')
  async verifyUserTokenEmailConfirm(
    @Param('token') token: string
  ):Promise<any>{
    return this.userService.verifyUserTokenEmailConfirm(token)
  }


}
