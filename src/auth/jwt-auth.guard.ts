// import {
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION_ } from './decorator/customize';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private reflector: Reflector) {
//     super();
//   }
//   canActivate(context: ExecutionContext) {
//     // lấy ra metadata , lấy ra value của key IS_PUBLIC_KEY
//     // this.reflector để lấy ra metadata
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) {
//       return true;
//     }
//     // check jwt
//     return super.canActivate(context);
//   }
//   // ko public 
//   // lấy kết quả từ jwt strategy
  
//  handleRequest(err, user, info, context: ExecutionContext) {
//   if (err || !user) {
//     throw err || new UnauthorizedException('Token không hợp lệ: Ngô Đình');
//   }

//   const request = context.switchToHttp().getRequest();
//   const targetMethod = request.method.toUpperCase();
//   const targetEndpoint = request.route?.path;

//   const permissions = user.permissions || [];

//   // In ra debug
//   // console.log('>>> METHOD:', targetMethod);
//   // console.log('>>> PATH:', targetEndpoint);
//   // console.log('>>> PERMISSIONS:', permissions);

//   // So sánh method và route path
//   let isExist = permissions.find(permission =>
//     permission.method.toUpperCase() === targetMethod &&
//     permission.apiPath === targetEndpoint
//   );

//   // Bỏ qua kiểm tra permission nếu endpoint nằm trong danh sách bỏ qua
//   const skipEndpoints = [
//     '/api/v1/auth/account',
//     '/api/v1/auth/logout',
//     '/api/v1/auth/refresh',
//   ];
//   if (skipEndpoints.includes(targetEndpoint)) {
//     isExist = true;
//   }
//   console.log("isExist", isExist)
//   // Hoặc nếu controller/method được đánh dấu public permission
//   const IS_PUBLIC_PERMISSION = this.reflector.getAllAndOverride<boolean>(
//     IS_PUBLIC_PERMISSION_,
//     [context.getHandler(), context.getClass()]
//   );

//   if (!isExist && !IS_PUBLIC_PERMISSION) {
//     throw new ForbiddenException('Bạn không có quyền truy cập endpoint');
//   }

//   return user;
//   }
// }
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION_ } from './decorator/customize';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ: Ngô Đình');
    }

    const request = context.switchToHttp().getRequest();

    const targetMethod = request.method?.toUpperCase() || '';
    const targetEndpoint = request.route?.path || request.path || '';

    const permissions = user.permissions || [];

    // Debug thông tin quan trọng
    console.log('=== DEBUG PERMISSION CHECK ===');
    console.log('Request method      :', targetMethod);
    console.log('Request endpoint    :', targetEndpoint);

    const matchedPermission = permissions.find(permission =>
      permission.method?.toUpperCase() == targetMethod &&
      permission.apiPath == targetEndpoint
    );

    // Danh sách endpoint được bỏ qua kiểm tra permission
    const skipEndpoints = [
      '/api/v1/auth/account',
      '/api/v1/auth/logout',
      '/api/v1/auth/refresh',
    ];

    const IS_PUBLIC_PERMISSION = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION_,
      [context.getHandler(), context.getClass()]
    );

    const hasPermission =
      !!matchedPermission ||
      skipEndpoints.includes(targetEndpoint) ||
      IS_PUBLIC_PERMISSION;

    console.log('Matched permission  :', matchedPermission);
    console.log('Skip endpoints match:', skipEndpoints.includes(targetEndpoint));
    console.log('IS_PUBLIC_PERMISSION:', IS_PUBLIC_PERMISSION);
    console.log('Has permission      :', hasPermission);
    console.log('===============================');

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập endpoint');
    }

    return user;
  }
}
