import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJWTResponse } from 'src/types/types';
import { Notifications, NotificationsDocument } from './schemas/notifications.schema';
import * as webPush from 'web-push'

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
                return await this.notificationModel.find({user_id: user?.sub}).sort({created_at: -1}).exec()
            }
        } catch (e) {
            this.logger.error(e?.message, e?.stack)
            throw new HttpException(e?.message, e?.status)
        }
    }

    async deleteNotification(id: string, user: IJWTResponse):Promise<Notifications>{
        try {
            if(user){
                return await this.notificationModel.findOneAndDelete({_id: id}).exec()
            }
        } catch (e) {
            this.logger.error(e?.message, e?.stack)
            throw new HttpException(e?.message, e?.status)
        }
    }


    //THE PUSH NOTIFICATION 
    // BBMWPwIYH1dEWV2KujrRiZS_T5CtwAOQvXCw-vxTdap00xqJ0dNYYczPa_tvdTD7haxv7i2-6SAlQUzJpQGdiw8
    
    async pushNotification(
        pushNotificationDto: any
    ) {
        const PublicVapidKey = "BBMWPwIYH1dEWV2KujrRiZS_T5CtwAOQvXCw-vxTdap00xqJ0dNYYczPa_tvdTD7haxv7i2-6SAlQUzJpQGdiw8";
        const PrivateVapidKey = "pUVhl871kFJcNkL7sd_tZX2U72G1Gyo_uV3i0Yv2Lrc"

        webPush.setVapidDetails("mailto: derrick@upnmg.com", PublicVapidKey, PrivateVapidKey)

        //subscribe route
        const subscription = pushNotificationDto

        //create payLoad = 
        const payLoad = JSON.stringify({title: 'Test notification'})

        // pass the subscription and payLoad obj to 
        webPush.sendNotification(subscription, payLoad).catch(err => console.error(err))

        console.log('subscription', subscription)
    }
    
}
