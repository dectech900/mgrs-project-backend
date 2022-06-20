import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name)
    constructor(@InjectQueue('activities') private readonly taskQueue: Queue){}

    // @Cron('0 8 * * *')
    async fetchUser(): Promise<boolean>{
        await this.taskQueue.add('fetch-user', {
            timestamp: new Date().toISOString()
        })
        return true
    }
}
