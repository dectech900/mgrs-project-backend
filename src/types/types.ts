export interface IJWTResponse {
  email: string;
  sub: string;
  user_type: string;
}

export interface IUploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export interface IPaginate<T> {
  docs: ReadonlyArray<T>;
  totalItems: number;
  totalPages: number;
  currentPageSize: number;
  size: number;
  page: number;
  links: any;
}

export interface IPaginateOptions {
  page: number;
  size: number;
  url: string;
}

export interface IJWTResponse {
  sub: string;
  user_type: string;
  email: string;
  staff_id: string;
}

export enum USER_TYPE {
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
}
