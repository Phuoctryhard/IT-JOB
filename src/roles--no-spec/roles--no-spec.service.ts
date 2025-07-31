import { Injectable } from '@nestjs/common';
import { CreateRolesNoSpecDto } from './dto/create-roles--no-spec.dto';
import { UpdateRolesNoSpecDto } from './dto/update-roles--no-spec.dto';

@Injectable()
export class RolesNoSpecService {
  create(createRolesNoSpecDto: CreateRolesNoSpecDto) {
    return 'This action adds a new rolesNoSpec';
  }

  findAll() {
    return `This action returns all rolesNoSpec`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesNoSpec`;
  }

  update(id: number, updateRolesNoSpecDto: UpdateRolesNoSpecDto) {
    return `This action updates a #${id} rolesNoSpec`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolesNoSpec`;
  }
}
