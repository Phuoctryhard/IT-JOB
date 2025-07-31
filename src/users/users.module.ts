import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/roles.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Role.name, schema: RoleSchema }]),
    // bảo moogno tôi đang muôn sử dụng userScheme
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // export ra để module bên kia dùng
  exports: [UsersService],
})
export class UsersModule {}
