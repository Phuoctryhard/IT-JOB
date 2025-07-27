
// coccoc.com/search?query=response+with+interceptor+nestjs
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message : string ,
  statusCode: number;
  data: any
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map((data) => ({

          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message,
          data : {
            result : data.result ,
            meta : data.meta
          },
        })),
      );
  }
}