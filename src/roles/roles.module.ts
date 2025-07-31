import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/roles.schemas';
import { Permisson, PermissonSchema } from 'src/permissions/schemas/permission.schemas';

@Module({
  imports:[MongooseModule.forFeature([{
    name : Role.name, schema : RoleSchema },{ name : Permisson.name,schema : PermissonSchema
  }])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // 👈 Bắt buộc phải có
})
export class RolesModule {}
