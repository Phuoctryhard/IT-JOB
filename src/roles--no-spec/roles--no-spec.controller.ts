import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesNoSpecService } from './roles--no-spec.service';
import { CreateRolesNoSpecDto } from './dto/create-roles--no-spec.dto';
import { UpdateRolesNoSpecDto } from './dto/update-roles--no-spec.dto';

@Controller('roles--no-spec')
export class RolesNoSpecController {
  constructor(private readonly rolesNoSpecService: RolesNoSpecService) {}

  @Post()
  create(@Body() createRolesNoSpecDto: CreateRolesNoSpecDto) {
    return this.rolesNoSpecService.create(createRolesNoSpecDto);
  }

  @Get()
  findAll() {
    return this.rolesNoSpecService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesNoSpecService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolesNoSpecDto: UpdateRolesNoSpecDto) {
    return this.rolesNoSpecService.update(+id, updateRolesNoSpecDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesNoSpecService.remove(+id);
  }
}
