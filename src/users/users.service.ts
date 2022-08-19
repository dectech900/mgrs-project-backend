import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChangeEmailPasswordDto,
  ChangePasswordDto,
} from '../auth/dto/change-password.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../auth/dto/forgot-password.dto';
import { Config } from '../config/config';
import { IJWTResponse, IUploadFile } from '../types/types';
import {
  decrypt,
  encrypt,
  excelParcer,
  hashPassword,
  verifyPassword,
} from '../utils/helpers';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from '../notifications/notifications.service';
import { Notifications } from '../notifications/schemas/notifications.schema';
import * as moment from 'moment';
import { genSaltSync } from 'bcrypt';
import { CreateAdminUsersDto, CreatesStudentDto } from './dto/create-admin-users.dto';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly config: Config,
    private readonly mailerService: MailerService,
    @InjectModel(Notifications.name)
    private readonly notificationModel: Model<Notifications>
  ) {}

  async createAdminUsers(user: CreateAdminUsersDto):Promise<User>{
    return this.userModel.create({
      ...user,
      password: hashPassword(user?.password, 10)
    })
  }

  async createStudent(body: CreatesStudentDto):Promise<User>{
    try {
      return await this.userModel.create({...body, password: hashPassword(body.password, 10)})
    } catch (error) {
      console.log(error)
    }
  }

  async authenticate(user: string): Promise<User> {
    return await this.userModel
      .findOne({
        $or: [{ staff_id: user }, { email: user }, {student_id: user}],
      })
      .exec();
  }

  async me(user: IJWTResponse): Promise<User> {
    return this.userModel.findById(user?.sub);
  }

  //get all users
  // async getUsers(): Promise<User[]> {
  //   return await this.userModel.find().exec();
  // }

  //get  user by Id
  async getUserById(user_id: string): Promise<any> {
    // console.log('user_id', user_id)

    return await this.userModel.findById(user_id).exec();
  }


  async forgotCustomerPassword(body: ForgotPasswordDto) {
    try {
      const { email } = body;
      const emailExist = await this.userModel
        .findOne({ email: email.toLowerCase() })
        .select('email name username ')
        .exec();
      if (!emailExist) {
        throw new NotFoundException(
          null,
          "Email address doesn't exist in our system",
        );
      }
      const code = encrypt(
        `${emailExist?._id}|${emailExist?.email}|${moment().add(5, 'minutes')}`,
        this.config.get('encryptionKey'),
      );

      console.log('code', code);
      console.log('..........');
      console.log('Decrypted', decrypt(code, this.config.get('encryptionKey')));

      //store code and send code to user
      const user = await this.userModel
        .findOneAndUpdate(
          { _id: emailExist?._id },
          {
            reset_password_token: code,
            is_used: false,
          },
        )
        .exec();

      const url = `${this.config.get(
        'app.client_base_url',
      )}/account/password-reset?token=${encodeURIComponent(code)}`;
      // user?.name.split(' ')[1]
      const mail = this.mailerService.sendMail({
        from: 'UPNMG SUPPORT TEAM <derricka@tiqniat.com>',
        to: email.toLowerCase(),
        subject: 'Password Reset',
        html: `<p>Hi ${
          emailExist?.name.split(' ')[1]
        }, you requested for a reset of password, kindly click on the link below to follow the instructions\n <a href="${url}">${url}</a> .\n Ignore this if you didn't request for a reset of password</p>`,
      });

      if (mail) {
        this.logger.log(mail);
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async verifyCustomerToken(token: string) {
    try {
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async validateResetPasswordToken(token: string): Promise<any> {
    try {
      const decrypted = decrypt(token, this.config.get('encryptionKey'));
      this.logger.log(
        'Verification payload ::: {}'.replace('{}', JSON.stringify(decrypted)),
      );
      return decrypted;
    } catch (e) {
      this.logger.log(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async resetCustomerPassword(
    // user: IJWTResponse,
    body: ResetPasswordDto,
  ): Promise<User> {
    //generate token and send it and save it
    try {
      let decrypted = await this.validateResetPasswordToken(body?.token);

      this.logger.log(
        'Token request ::: {token} '.replace('{token}', body.token),
      );
      this.logger.log(
        'Decrypted response :::: {}'.replace('{}', JSON.stringify(decrypted)),
      );
      console.log('decrypted', decrypted);

      const userData = await this.userModel.findOne({
        _id: decrypted?.split('|')[0],
      });
      if (!userData) {
        throw new NotFoundException(null, "User doesn't exist in our system");
      }
      if (userData?.is_used) {
        throw new HttpException(
          `Reset token's already been used. Request for new one.`,
          400,
        );
      }
      if (body?.newPassword !== body?.confirmPassword) {
        throw new HttpException(
          `Your new password and confirm password doesn't match. Try again`,
          400,
        );
      }
      if (
        moment(new Date(decrypted?.split('|')[2]))
          .utc()
          .isBefore(moment())
      ) {
        throw new HttpException(
          `Reset password token expired. Request for new one`,
          400,
        );
      }
      //update user
      let salt = genSaltSync()
      const passwordHash = hashPassword(body?.newPassword, salt as any)
      console.log('passwordHash', passwordHash)
      
     const user = await this.userModel.findOneAndUpdate({
      _id: decrypted?.split('|')[0]
      }, {password: passwordHash, is_used: true}).exec()

      return user

    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }

    return;
  }

  //change password
  async changePassword(
    user: IJWTResponse,
    body: ChangePasswordDto,
  ): Promise<any> {
    try {
      if (user) {
        const { password, confirmPassword } = body;

        if (password !== confirmPassword)
          throw new HttpException('Password do not match', 400);
        //check if is a valid
        const userData = await this.userModel.findOne({ _id: user?.sub });
        if (userData) {
          const changedPwd = await this.userModel.findByIdAndUpdate(
            { _id: user?.sub },
            {
              password: hashPassword(password, 10),
              changed_password: true,
            },
          );
          if (changedPwd) {
            //update notification
            const notification = {
              title: 'Password change',
              message: 'Your new password was changed successfully.',
            };
            await this.notificationModel.create({
              title: notification?.title,
              message: notification?.message,
              user_id: user?.sub,
              staff_id: user?.staff_id,
            });
          }
        } else {
          throw new HttpException('Password do not match', 400);
        }
      }
    } catch (e) {
      this.logger.log(e?.message, e?.status);
      throw new HttpException(e?.message, e?.status);
    }
  }
  //change password
  async changeEmailPassword(
    user: IJWTResponse,
    body: ChangeEmailPasswordDto,
  ): Promise<any> {
    try {
      if (user) {
        console.log('body', body)
        const { password, confirmPassword, email } = body;
        if (password !== confirmPassword)
          throw new HttpException('Password do not match', 400);
        //check if is a valid
        const emailExist = await this.userModel.exists({
          email: email.toLowerCase(),
        });
        if (emailExist) {
          throw new HttpException(
            'Email already taken, use a different email address',
            409,
          );
        }

        const userInserted = await this.userModel.findOneAndUpdate(
          { _id: user?.sub },
          {
            password: hashPassword(password, 10),
            changed_password: true,
            email: email.toLowerCase(),
            is_account_active: true,
          },
          { new: true },
        );
        console.log('Password and email changed', userInserted)
        if (userInserted) {
          //send email verification message
          const verify = this.sendVerificationEmail({ email, user });
          const notification = {
            title: 'Email added and Password changed ',
            message:
              'Email had been sent to your email address kindly open your email account and click on the verify button to activate your account.',
          };
          await this.notificationModel.create({
            title: notification?.title,
            message: notification?.message,
            user_id: user?.sub,
            staff_id: user?.staff_id,
          });
          return verify;
        }
      }
    } catch (e) {
      this.logger.log(e?.message, e?.status);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async sendVerificationEmail(
    payLoad: { email: string; user: IJWTResponse },
    // user: any,
  ): Promise<any> {
    const { email, user } = payLoad;
    const userData = await this.userModel.findOne({_id: user?.sub}).select('name').exec()
    console.log('user', userData)

    const token = this.jwtService.sign(
      { payLoad },
      {
        secret: this.config.get('emailVerifyKey'),
        expiresIn: '1hr',
      },
    );
    const url = `${this.config.get(
      'app.client_base_url',
    )}/account/verifyemail?token=${encodeURIComponent(token)}`;

    // TODO://send mail to the user
    const message = ` <body style='background-color: #f4f4f4;'>
    <div style='display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #f4f4f4;'>
      <div style='text-align: center; padding: 1rem; background-color: white;'>
          <p style='font-size: 1.3rem;'>Hi <strong>${userData.name.split(' ')[1]},</strong></p> 
          <p style='font-size: 1.5rem;'>Thanks for joining UPNMG.</p>
          <p style='font-size: 1.5rem;'>In order to confirm your Identity, we need to verify your email address.</p>
          <div style='text-align: center;'><a href='${url}' target='_blank' style='padding: 12px 40px; background-color: rgb(0, 165, 102); color: white; font-size: 1.4rem;text-decoration: none; border-radius: .3rem;'>Click Here To Verify</a></div> <br/>

          <p style='font-size: 1.5rem;'>If this link doesn’t work for some reason, or you would rather not click on it, you can also confirm your email address by copying and pasting the following link into your browser:</p><br/>
          <p style='font-size: 1.2rem;'>${url}</p> 
          <p style='font-size: 1.5rem;'>If you believe that this message was sent by mistake, please ignore this email.</p>
         
          <h3 style='color: rgb(0, 165, 102); font-size: 1.8rem;font-style: italic;'>UPNMG IT DEPARTMENT</h3>
          </div>
      </div>
  </body>`;

    // return message

    const sent = await this.mailerService.sendMail({
      from: 'UPNMG TEAM <derricka@tiqniat.com>',
      to: email,
      subject: 'Confirm your email address',
      html: message,
    });
    this.logger.log(sent);
    if (sent) {
      return `Email had been sent. Please check your email to verify your account`;
    }
  }

  async verifyUserTokenEmailConfirm(token: string) {
    try {
      
      console.log('token', token)

      const userPayLoad = await this.jwtService.verify(token, {
        secret: this.config.get('emailVerifyKey'),
      });
     
      const { payLoad } = userPayLoad;
      this.logger.log(
        `Verification payload ::: {}`.replace('{}', JSON.stringify(payLoad)),
      );
      console.log('payLoad.user', payLoad?.email);
      if (payLoad?.email) {
       const emailVerified =  await this.userModel
          .findOneAndUpdate(
            { _id: payLoad?.user?.sub },
            {
              is_account_active: true,
              is_email_verified: true,
            },
          )
          .exec();
          
          if(emailVerified){
            const user = await this.userModel.findOne({email: payLoad?.email})
            const notification = {
              title: 'Email verified',
              message: 'Your email has been verified.',
            };
            await this.notificationModel.create({
              title: notification?.title,
              message: notification?.message,
              user_id: user?._id,
              staff_id: user?.staff_id,
            });
          }
        return 'Email verified';
      }
    } catch (e) {
      this.logger.log(e?.messgae);
      throw new HttpException(e?.messgae, e?.status);
    }
  }

  //Update user
  async updateUser(user: IJWTResponse, body: UpdateUserDto): Promise<User> {
    try {
      const {
        description,
        email,
        phone_number,
        username,
        cover_image,
        profile_image,
      } = body;
      const userD = await this.userModel.findOneAndUpdate(
        { _id: user?.sub },
        {
          email,
          username,
          phone_number,
          description,
          cover_image,
          profile_image,
        },
        { new: true },
      );
      return userD;
    } catch (e) {
      this.logger.error(e?.message, e?.status);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //Upload users
  // async uploadUsers(file: IUploadFile): Promise<any> {
  //   if (!file || !file?.path) {
  //     throw new NotFoundException(null, 'No file was uploaded');
  //   }

  //   await this.jobService.bulkUsersUpload(file);
  //   return true;
  // }
}
