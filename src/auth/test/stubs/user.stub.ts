// import { User } from '../../../users/schemas/user.schema';
// import { RegisterCustomerDto } from '../../../auth/dto/register-customer.dto';
// import { USER_TYPE } from '../../../types/types';
// import { DeleteResult } from 'src/types/types';
// import { UpdateUsersProfileDto } from 'src/users/dto/update-user.dto';

// export const userStub = (
//   username?: string,
//   allow_2step_verification?: boolean,
// ): User & { _id: string } => {
//   return {
//     _id: '1234',
//     username: username ?? 'test',
//     password: 'password',
//     email: 'email@gmail.com',
//     first_name: 'Lord',
//     last_name: 'Key',
//     is_account_active: true,
//     profile_image: '',
//     role_id: '',
//     business_id: '',
//     is_email_verified: true,
//     accept_privacy_policy: true,
//     user_type: '',
//     deleted_at: '',
//     personal_address: 'Address one',
//     phone_number: '2332000000000',
//     is_used: false,
//     reset_password_token: '',
//     allow_2step_verification: allow_2step_verification ?? true,
//     lastLoggedIn: '2021-01-02',
//   };
// };

// export const userRegisterStub = (
//   businessType?: USER_TYPE,
// ): RegisterCustomerDto => {
//   return {
//     username: 'user@123',
//     password: 'password',
//     email: 'email@gmail.com',
//     first_name: 'Lord',
//     last_name: 'Kay L',

//     ...(businessType === USER_TYPE.BUSINESS && {
//       plan_id: '61114460587eb9d35ab71ea6',
//       business_name: 'TESTING USER',
//     }),
//     user_type: businessType ?? USER_TYPE.BUSINESS,
//     accept_privacy_policy: true,
//     accept_declaration: true,
//   };
// };

// export const userUpdateModelStub = () => {
//   return {
//     acknowledged: true,
//     matchedCount: 1,
//     modifiedCount: 1,
//     upsertedCount: 1,
//     upsertedId: null,
//   };
// };

// export const userDeleteModelStub = (): DeleteResult => {
//   return {
//     acknowledged: true,
//     deletedCount: 1,
//   };
// };
// export const userUpdateStub = (): UpdateUsersProfileDto => {
//   return {
//     first_name: 'Derrick',
//     last_name: 'Agyapong',
//     username: 'dectech900',
//     profile_image: 'www.myprofile.image.org',
//   };
// };
