import { PartialType } from '@nestjs/swagger';
import { CreateRolesNoSpecDto } from './create-roles--no-spec.dto';

export class UpdateRolesNoSpecDto extends PartialType(CreateRolesNoSpecDto) {}
