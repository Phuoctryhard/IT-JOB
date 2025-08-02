import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subsribers, SubsribersSchema } from 'src/subsribers/schemas/subsribers.schemas';
import { Jobs, JobsSchema } from 'src/jobs/schemas/jobs.schemas';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAILHOST'),
          secure: false,
          auth: {
            user: configService.get<string>('SENDER_EMAIL'),
            pass: configService.get<string>('PASSWORD_EMAIL'),
          },
        },

        // báo cáo địa chỉ sử dụng
        template: {
          // dirname : thư muc root là src

          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true,
      }),
      // import configSerrvice

      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{name : Subsribers.name,schema:SubsribersSchema},{
      name : Jobs.name,schema:JobsSchema
    }])
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
