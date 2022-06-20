import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { IJWTResponse } from 'src/types/types';
import { JobServiceImpl } from './jobs-service.impl';

@Processor('activities')
export class JobProcessor {
  private readonly logger = new Logger(JobProcessor.name);
  constructor(private readonly jobServiceImpl: JobServiceImpl) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Job ${job.name} with ${job.id} has started`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Complete job ${job.id} with ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.debug(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stuck,
    );
  }

  @Process('fetch-user')
  async onFetchingUser(
      job: Job<{user: IJWTResponse}>
  ):Promise<void>{
    const {user} = job.data
  return  await this.jobServiceImpl.fetchUsers()
  } 
}
