import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CompaniesModule } from './companies/companies.module';
import { MailModule } from './mail/mail.module';
import { TransformInterceptor } from './core/transform.interceptor';
import { JobsModule } from './jobs/jobs.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadFileModule } from './upload-file/upload-file.module';

const { softDeletePlugin } = require('soft-delete-plugin-mongoose');

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      // config servive vs moongo
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MoongoDB'),
        connectionFactory: (connection) => {
          console.log("Đã kết nối DB")
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CompaniesModule,
    MailModule,
    JobsModule,
    ResumesModule,
    PermissionsModule,
    RolesModule,
    CloudinaryModule,
    UploadFileModule,
  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // nên cấu hình global bên main 
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  //Bạn nên đăng ký global interceptor từ trong module như sau:Với cách này, interceptor nằm trong NestJS DI container, nên bạn có thể inject mọi thứ như ConfigService, UserService, v.v.
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
})
export class AppModule {}
