import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // giải mã request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }
  // decode phần user
  async validate(payload: any) {
    // trả ra cái user để bên kia nạp vào req.user
    return { userId: payload.sub, username: payload.username };
  }
}

// nhớ khai báo JwtStrategy : ở provider
