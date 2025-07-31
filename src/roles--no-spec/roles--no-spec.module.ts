import { Module } from '@nestjs/common';
import { RolesNoSpecService } from './roles--no-spec.service';
import { RolesNoSpecController } from './roles--no-spec.controller';

@Module({
  controllers: [RolesNoSpecController],
  providers: [RolesNoSpecService]
})
export class RolesNoSpecModule {}
