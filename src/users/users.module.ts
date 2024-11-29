import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // bảo moogno tôi đang muôn sử dụng userScheme
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
