import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // dùng super là nó sẽ kế thừa lại all passport local vì mình truyển vào strategy local
    super();
  }
  // bởi vì mình kế thừa nên phải dùng đúng tên hàm
  // 2 tham số người dùng gửi lên nó sẽ vào đó
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
