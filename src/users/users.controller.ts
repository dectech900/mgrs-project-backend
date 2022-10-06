import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IJWTResponse, IUploadFile, ROLE } from 'src/types/types';
import { User } from './schemas/users.schema';
import { User as IUser } from '../decorators/user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminUsersDto, CreatesStudentDto } from './dto/create-admin-users.dto';
import { Roles } from 'src/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadUsers(@UploadedFile() file: IUploadFile): Promise<any> {
  //   console.log('file', file)
  //   return await this.userService.uploadUsers(file);
  // }

  @Post('/student/create')
  async createStudent(@Body() body: CreatesStudentDto): Promise<User> {
    return await this.userService.createStudent(body)
  }

  @Get('/profile/me')
  @UseGuards(JwtAuthGuard)
  async me(@IUser() user: IJWTResponse): Promise<User> {
    return await this.userService.me(user);
  }


  // @Get()
  // async getUsers(): Promise<User[]> {
  //   return await this.userService.getUsers();
  // }

  @Get('/user/type')
  async getAllUsersByType(
    @Query('user_type') user_type: string
  ): Promise<any> {
    return await this.userService.getAllUsersByType(user_type);
  }

  @Get('/user')
  async getUserById(
    @Query('user_id') user_id: string
    // @Param('user_id') user_id: string
  ): Promise<any> {
    return await this.userService.getUserById(user_id);
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
    // console.log('token', token)
    return this.userService.verifyUserTokenEmailConfirm(token)
  }

  @Post('/admin/create')
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  async createAdminUsers(
    @Body(new ValidationPipe({transform: true})) users: CreateAdminUsersDto
  ):Promise<any>{
    return this.userService.createAdminUsers(users)
  }


}
