import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// kế thừa strategy local . mình đã viết bên passport
export class LocalAuthGuard extends AuthGuard('local') {}
