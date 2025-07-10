import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/auth/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,

    private readonly mailerService: MailerService,
  ) {}
  @Get()
  @Public()
  async test() {
    // hàm thư viện viết sẵn của node mailer
    await this.mailerService.sendMail({
      // gửi nhiều người cũng dc
      to: 'nguyenvanhuy20053012@gmail.com', // list of receivers
      // tiêu đề
      from: 'noreply@nestjs.com', // sender address
      // tiêu đề
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      // nội dung
      // lí do lỗi vì nodejs đọc javascipt thôi nên hắn chạy ở file dict á, nestjs dịch typescript thành js , all file còn lại ko dịch nên ko dịch file hbs

      template: 'new-job',
    });
  }
}
