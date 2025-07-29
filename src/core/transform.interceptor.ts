
// coccoc.com/search?query=response+with+interceptor+nestjs
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from 'src/auth/decorator/customize';

export interface Response<T> {
  message : string ,
  statusCode: number;
  data: any
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
  
    return next
      .handle()
      .pipe(
        map((data) => ({
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: this.reflector.get<string>(
            RESPONSE_MESSAGE,
            context.getHandler(),
          ) || '',
          data
        })),
      );
  }
}

