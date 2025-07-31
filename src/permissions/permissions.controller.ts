import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { response_Message, User } from 'src/auth/decorator/customize';
import { QueryPermisson } from './dto/query-permission.dto';
import { IUser } from 'src/users/user.interface';

@ApiTags(api_tags.PERMISSION)
@ApiBearerAuth('access-token') // 👈 trùng với tên ở .addBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @response_Message("Tạo permission thành công")
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto , @User() user : IUser) {
    return this.permissionsService.create(createPermissionDto,user);
  }

  @ApiOperation({summary: "Lấy danh sách Permission"})
  @response_Message("Lấy danh sách permission thành công")
  @Get()
  findAll(@Query('current') currentPage : string , 
      @Query('pageSize') limit : string,
      @Query() qs : QueryPermisson,
  ) {
    return this.permissionsService.findAll(+currentPage,+limit,qs);
  }

@response_Message("Lấy Permission theo ID")
  @ApiOperation({summary: "Lấy Permission theo ID "})
  @Get(':id')
   @ApiParam({
    name :'id',
    required: true,
    description: 'ID permission',
    example: '686e31205a7ab658c280615e', // ví dụ ID Mongo
  })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
@response_Message("Cập nhật Permission")
    @ApiOperation({summary: "Cập nhật Permission"})
    @ApiParam({
      name :'id',
      required: true,
      description: 'ID permission',
      example: '688b32e790d8c0eed617c930', // ví dụ ID Mongo
    })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto,@User() user: IUser,) {
    return this.permissionsService.update(id, updatePermissionDto,user);
  }


  @response_Message("Xóa permission")
  @ApiOperation({summary: "Xóa permission"})
    @ApiParam({
      name :'id',
      required: true,
      description: 'ID permission',
      example: '688b32e790d8c0eed617c930', // ví dụ ID Mongo
    })
  @Delete(':id')
  remove(@Param('id') id: string,@User() user: IUser) {
    return this.permissionsService.remove(id,user);
  }
}
