import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { response_Message, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { QueryRoles } from './dto/query-role.dto';
@ApiTags(api_tags.ROLE)
@ApiBearerAuth('access-token') // 👈 trùng với tên ở .addBearerAuth()

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @response_Message("Tạo role thành công")
  create(@Body() createRoleDto: CreateRoleDto, @User() user : IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @response_Message("Lấy danh sách  thành công")
  findAll(
    @Query('current') currentPage : string , 
      @Query('pageSize') limit : string,
      @Query() qs : QueryRoles,
  ) {
    return this.rolesService.findAll(+currentPage,+limit,qs);
  }

  @Get(':id')
   @ApiOperation({summary: "Lấy a Roles"})
    @ApiParam({
      name :'id',
      required: true,
      description: 'ID của Roles ',
      example: '688b32e790d8c0eed617c930', // ví dụ ID Mongo
    })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
   @ApiOperation({summary: "Cập nhật Roles"})
    @ApiParam({
      name :'id',
      required: true,
      description: 'ID của Roles cần cập nhật',
      example: '688b32e790d8c0eed617c930', // ví dụ ID Mongo
    })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser,) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
    @ApiOperation({summary: "Xóa role"})
  @ApiParam({
    name :'id',
    required: true,
    description: 'ID của role',
    example: '686e31205a7ab658c280615e', // ví dụ ID Mongo
  })
  remove(@Param('id') id: string,@User() user: IUser) {
    return this.rolesService.remove(id,user);
  }
}
