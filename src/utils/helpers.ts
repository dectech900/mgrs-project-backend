import { compareSync, hashSync } from 'bcrypt';

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


