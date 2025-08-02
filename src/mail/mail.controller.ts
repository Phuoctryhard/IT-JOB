import { Controller, Get, Inject } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, response_Message } from 'src/auth/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { InjectModel } from '@nestjs/mongoose';
import { Subsribers, SubsribersDocument } from 'src/subsribers/schemas/subsribers.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Jobs, JobsDocument } from 'src/jobs/schemas/jobs.schemas';
import { find } from 'rxjs';

import { Cron } from '@nestjs/schedule';
@ApiTags(api_tags.MAIL)
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,

    private readonly mailerService: MailerService,

    @InjectModel(Subsribers.name)
    private SubscriberModel : SoftDeleteModel<SubsribersDocument>,
    @InjectModel(Jobs.name)
    private JobsModel : SoftDeleteModel<JobsDocument>
  ) {}
  @response_Message("Test mail")
  @Cron("0 10 0 * * 0") // every sunday// 00:10 AM every Sunday
  @Get()
  @Public()
  async handletestEmail() {
    const subscribers = await this.SubscriberModel.find({})
    for(const subscriber of subscribers){
      const subSkills = subscriber.skills
      const findJob = await this.JobsModel.find({skills : {$in:subSkills}})   
      const Jobs = findJob.map(item=>{
        return {
          name : item.name,
          company :item.company.name,
          salary:`${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
          skills:item.skills
        }
      })
      await this.mailerService.sendMail({
      // gửi nhiều người cũng dc
      to: subscriber.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      // tiêu đề
      subject: 'Công việc phù hợp với bạn 🔍', // Subject line
      text: 'Chào bạn,\n\nDưới đây là một số công việc phù hợp với kỹ năng của bạn:', // plaintext body
      template: 'new-job',
      context:{
        name : subscriber.name,
        jobs:Jobs
      }
    });
    }
  }
}
