import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const RESPONSE_MESSAGE ='response_message'
// Định nghĩa 1 decorator Public
//mục địch định nghĩa 1 decorator :  truyền metadata lên function . metadata là key : value thông tin đính kèm
// ném metadata vào @decorator public , nestjs xử lí function login sẽ lấy dc metadata

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // key : value
// custom decorator do chúng ta viết
// decorator User thay vì user= req.user
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
// decorate custome Message 
export const response_Message = (message) => SetMetadata(RESPONSE_MESSAGE, message); // key : value
