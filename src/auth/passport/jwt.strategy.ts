import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // giải mã request giải mã access toekn
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // có key mới giả mã mât khẩu dc

      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN'),
    });
  }
  // trả về thoogn tin người dùng sau khi giải mã
  async validate(payload: any) {
    // trả ra cái user để bên kia nạp vào req.user
    return { userId: payload.sub, username: payload.username };
  }
}

// nhớ khai báo JwtStrategy : ở provider
