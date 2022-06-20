import { Injectable } from "@nestjs/common";
import { env } from "./env.config";

@Injectable()
export class Config {
    get(key: string):any {
        const keys = key.split('.')
        let variables = env
        for(let i=0; i < keys.length; i++){
            const key = keys[i]
            if(key in variables){
                variables = variables[key]
            }
        }
        return variables ?? null
    }
}