import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// đang sử dụng jwt
export class JwtAuthGuard extends AuthGuard('jwt') {}
