import { ResetPasswordDto } from 'src/auth/dto/forgot-password.dto';

export const resetPasswordStub = (): ResetPasswordDto => {
  return {
    token: 'password-reset-token',
    newPassword: 'testing',
    confirmPassword: 'testing',
  };
};
