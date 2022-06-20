import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJWTResponse } from 'src/types/types';
import { Notifications, NotificationsDocument } from './schemas/notifications.schema';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name)
    constructor(@InjectModel(Notifications.name) private readonly notificationModel: Model<NotificationsDocument>){}
    async createNotification(title: string, message: string):Promise<Notifications>{
        return await this.notificationModel.create({title: title, message:message})
    }

    async getNotification(user:IJWTResponse):Promise<any>{
        try {
           
            if(user){
                return await this.notificationModel.find({user_id: user?.sub}).exec()
            }
        } catch (e) {
            this.logger.error(e?.message, e?.stack)
            throw new HttpException(e?.message, e?.status)
        }
    }

    async deleteNotification(id: string, user_id: string):Promise<Notifications>{
        // return await this.notificationModel.find
        return
    }
    
}
