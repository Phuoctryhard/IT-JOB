import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorator/customize';
import { Reflector } from '@nestjs/core';
import { request as Request } from 'express';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // lấy ra metadata , lấy ra value của key IS_PUBLIC_KEY
    // this.reflector để lấy ra metadata
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // check jwt
    return super.canActivate(context);
  }
  // ko public 
  // lấy kết quả từ jwt strategy
  
  handleRequest(err, user, info,context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ : nGô đình ');
    }

// ✅ Lấy request từ context
  // const request = context.switchToHttp().getRequest();
  //   // check permission 
  //   const targetMethod = Request.method;
  //   const targetEndpoint = Request.route?.path;
        // ✅ Danh sách endpoint bỏ qua kiểm tra quyền
  const skipEndpoints = ['/api/v1/auth/account','/api/v1/auth/logout','/api/v1/auth/refresh'];

  //  // ✅ Nếu endpoint được skip → bỏ qua luôn kiểm tra permission
  //   if (skipEndpoints.includes(request.route?.path)) {
  //     return user;
  //   }
    // const permissions = user.permissions
    // const IsExist = permissions.find(permission=>{
    //   permission.method == targetMethod && targetEndpoint == permission.apiPath
    // }) 
 
    // if(!IsExist){
    //   console.log(targetEndpoint)
    //   throw new ForbiddenException("Bạn không có quyền truy cập endpoint")
    // }
    return user;
  }
}
