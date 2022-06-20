import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/forgot-password.dto';
import { resetPasswordStub } from './stubs/reset-password.stub';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            constructor: jest.fn(),
            authenticate: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            constructor: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

//   describe('validateUser', () => {
//     it('if user is found in the system', async () => {
//       jest
//         .spyOn(userService, 'authenticate')
//         .mockImplementation((username: string) => {
//           return Promise.resolve(userStub(username) as User);
//         });
//       service
//         .validateUser('test', 'password')
//         .then((response) => {
//           expect(response.username).toBe('test');
//           expect(response.email).toBe('email@gmail.com');

//           expect(userService.authenticate).toBeCalledTimes(1);
//           expect(userService.authenticate).toBeCalledWith('test');
//         })
//         .catch((e) => {
//           expect(e.response).toHaveProperty('statusCode');
//           expect(e?.response.message).toBe('Invalid email / password');
//         });
//     });

//     it('if user is found but account is mismatch', async () => {
//       jest
//         .spyOn(userService, 'authenticate')
//         .mockImplementation((username: string) => {
//           return Promise.resolve(userStub(username) as User);
//         });
//       try {
//         await service.validateUser('test', 'password@1234');
//       } catch (e) {
//         expect(e?.response).toHaveProperty(['statusCode']);
//         expect(e.status).toBe(401);
//         expect(e.response.message).toBe('Invalid email / password');
//       }
//     });
//   });

//   describe('Login', () => {
//     it('should return signed jwt token', async () => {
//       jest.spyOn(jwtService, 'sign').mockReturnValue('test-jwt');

//       service.login(userStub('test')).then((data) => {
//         expect(data.access_token).toBe('test-jwt');
//         expect(jwtService.sign).toHaveBeenCalledTimes(1);
//         expect(jwtService.sign).toBeCalledWith({
//           email: 'email@gmail.com',
//           sub: '1234',
//           role_id: null,
//           business_id: undefined,
//           user_type: '',
//         });
//       });
//     });
//   });

//   describe('Register', () => {
//     it('should register a customer details as a pet business', async () => {
//       jest.spyOn(service, 'register').mockImplementation(() => {
//         return Promise.resolve(userRegisterStub());
//       });

//       service.register(userRegisterStub()).then((data) => {
//         expect(data.user_type).toBe(USER_TYPE.BUSINESS);
//         expect(data.username).toBe('user@123');
//         expect(data.accept_privacy_policy).toBeTruthy();
//         expect(service.register).toBeCalledTimes(1);
//         expect(service.register).toBeCalledWith(userRegisterStub());
//       });
//     });
//   });

//   describe('Forgot Password', () => {
//     it('should return a token for resetting customer password', async () => {
//       jest
//         .spyOn(service, 'forgotPassword')
//         .mockImplementation((body: ForgotPasswordDto) => {
//           return Promise.resolve({ email: 'email@gmail.com' });
//         });

//       service.forgotPassword({ email: 'email@gmail.com' }).then((data) => {
//         expect(service.forgotPassword).toBeCalledWith({
//           email: 'email@gmail.com',
//         });
//         expect(service.forgotPassword).toBeCalledTimes(1);
//         expect(data).toBeDefined();
//         expect(data).toBeDefined();
//       });
//     });
//   });

//   describe('Reset Password', () => {
//     it('should reset customer password', async () => {
//       jest
//         .spyOn(service, 'resetPassword')
//         .mockImplementation((body: ResetPasswordDto) => {
//           return Promise.resolve(resetPasswordStub());
//         });

//       service.resetPassword(resetPasswordStub()).then((data) => {
//         expect(service.resetPassword).toBeCalledTimes(1);
//         expect(service.resetPassword).toBeCalledWith(resetPasswordStub());
//         expect(data).toBeDefined();
//         expect(data.token).toBe('password-reset-token');
//       });
//     });
//   });
});

