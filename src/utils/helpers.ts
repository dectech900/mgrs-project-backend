import { compareSync, hashSync } from 'bcrypt';
import { IPaginate, IPaginateOptions } from 'src/types/types';
import * as xlsx from 'xlsx'
import {AES, enc} from 'crypto-js'

export const apiPrefix = (env: string) => nodeEnv[env]

export const nodeEnv ={
    development: '/api/v1',
    staging: '/staging/v1',
    production: '/v1'
}

 export const verifyPassword = (text: string, password: string) => {
     return compareSync(text, password)
 }

 export const hashPassword = (password: string, salt?: number) => {
     return hashSync(password, salt)
 }

 export const sendEmail = ():any => {
    
 }

 export const encrypt = (text: string, key:string) => {
    return AES.encrypt(text, key).toString()
 }


 export const decrypt = (cipherText: string, key: string): string => {
    return AES.decrypt(cipherText, key).toString(enc.Utf8);
  };

 

 export const excelParcer = (
     file: string,
     callback: (data: unknown) => void,
     sheet: 'sheet 1'
 ) => {
    const workbook = xlsx.readFile(file, {
        cellDates: true,
        cellText: false,
        cellNF: false
    })

    const sheetNames = workbook.SheetNames
    const getNumber = (paper: string) => sheetNames.indexOf(paper) > -1 ? sheetNames.indexOf(paper) : 0
    const worksheet = workbook.Sheets[sheetNames[getNumber(sheet)]]

    const data = xlsx.utils.sheet_to_json(worksheet, {
        dateNF: 'YYYY-MM-DD'
    })
    data.forEach((content) => {
        callback(content)
    })
 }

 export const Paginate = <T> (
     items: ReadonlyArray<T>,
     count: number,
     options: IPaginateOptions
 ): IPaginate<T> => {
    const {url, page, size } = options
    const totalItems = count ?? 0
    const pages = Math.ceil(totalItems / size)

    return {
      docs: items,
      totalItems,
      totalPages: pages > 0 ? pages : 1,
      size: Number(size),
      page: Number(page),
      currentPageSize: items.length,
      links: {
          previous: page > 1 ? Number(page) - 1 : null,
          previousPage: page > 1 ? `${url}?page=${Number(page) - 1}&size=${size}`: null,
          nextPage: page >= pages ? null : `${url}?page=${Number(page) + 1}&size=${size}`,
          next: page >= pages ? null : Number(page) + 1
      }  
    }
 }

