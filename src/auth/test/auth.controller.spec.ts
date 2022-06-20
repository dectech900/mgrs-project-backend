import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterCustomerDto } from 'src/auth/dto/register-customer.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { resetPasswordStub } from './stubs/reset-password.stub';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            constructor: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('Login', () => {
  //   it('should return access_token', async () => {
  //     jest.spyOn(authService, 'login').mockImplementation((user: any) => {
  //       return Promise.resolve({ access_token: 'jwttoken' });
  //     });
  //     const token = await controller.logIn(userStub('test'));
  //     expect(token).toEqual({ access_token: 'jwttoken' });
  //     expect(authService.login).toBeCalled();
  //   });
  // });

  // describe('Register', () => {
  //   it('should save details of the customer as a pet business', async () => {
  //     jest
  //       .spyOn(authService, 'register')
  //       .mockImplementation((customer: RegisterCustomerDto) => {
  //         return Promise.resolve(userRegisterStub());
  //       });
  //     const customer = await controller.register(userRegisterStub());
  //     expect(customer.username).toBe('user@123');
  //     expect(customer.user_type).toBe(USER_TYPE.BUSINESS);
  //     expect(authService.register).toBeCalledTimes(1);
  //     expect(authService.register).toBeCalledWith(userRegisterStub());
  //   });

  //   it('should save details of the customer as a pet owner', async () => {
  //     jest
  //       .spyOn(authService, 'register')
  //       .mockImplementation((customer: RegisterCustomerDto) => {
  //         return Promise.resolve(userRegisterStub(USER_TYPE.OWNER));
  //       });
  //     const customer = await controller.register(
  //       userRegisterStub(USER_TYPE.OWNER),
  //     );
  //     expect(customer.username).toBe('user@123');
  //     expect(customer.user_type).toBe(USER_TYPE.OWNER);
  //     expect(authService.register).toBeCalledTimes(1);
  //     expect(authService.register).toBeCalledWith(
  //       userRegisterStub(USER_TYPE.OWNER),
  //     );
  //   });
  // });

  // describe('Forgot Password', () => {
  //   it('should return token for resetting customer password', async () => {
  //     jest
  //       .spyOn(authService, 'forgotPassword')
  //       .mockImplementation((body: ForgotPasswordDto) => {
  //         return Promise.resolve({ email: 'email@gmail.com' });
  //       });

  //     const forgotPassword = await controller.forgotPassword({
  //       email: 'email@gmail.com',
  //     });
  //     expect(authService.forgotPassword).toBeCalledTimes(1);
  //     expect(authService.forgotPassword).toBeCalledWith({
  //       email: 'email@gmail.com',
  //     });
  //     expect(forgotPassword).toBeDefined();
  //     expect(forgotPassword.email).toEqual('email@gmail.com');
  //   });
  // });

  // describe('Reset Password', () => {
  //   it('should change customer password to new one', async () => {
  //     jest
  //       .spyOn(authService, 'resetPassword')
  //       .mockImplementation((body: ResetPasswordDto) => {
  //         return Promise.resolve(resetPasswordStub());
  //       });

  //     const resetPassword = await controller.resetPassword(resetPasswordStub());
  //     expect(authService.resetPassword).toBeCalledTimes(1);
  //     expect(authService.resetPassword).toBeCalledWith(resetPasswordStub());
  //     expect(resetPassword).toBeDefined();
  //     expect(resetPassword.token).toBe('password-reset-token');
  //   });
  // });
});
