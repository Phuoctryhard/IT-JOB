import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permisson, PermissonSchema } from './schemas/permission.schemas';

@Module({
  imports:[MongooseModule.forFeature([{name : Permisson.name , schema : PermissonSchema}])],
  controllers: [PermissionsController],
  providers: [PermissionsService]
})
export class PermissionsModule {}
