import {
  Controller,
  Get,
  Render,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './auth/decorator/customize';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    // tạo token ở đây
    return this.authService.login(req.user);
  }
  // can co jwt để encode
  // @UseGuards(JwtAuthGuard)
  // muốn bỏ qua check JWT thì Public  , còn mặc định JWT  ///
  // @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  @Render('home')
  getHello() {
    const message = this.appService.getHello();
    const dbUser = this.configService.get<string>('PORT');
    console.log(dbUser);
    return { message: message };
  }
}
