import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/schemas/users.schema";

@Injectable()
export class JobServiceImpl{
    private readonly logger = new Logger(JobServiceImpl.name)
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

    async fetchUsers():Promise<any>{
        return  await this.userModel.find().exec()
    }
}