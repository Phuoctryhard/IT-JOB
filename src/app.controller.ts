import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  getHello() {
    const message = this.appService.getHello();
    const dbUser = this.configService.get<string>('PORT');
    console.log(dbUser);
    return { message: message };
  }
}
