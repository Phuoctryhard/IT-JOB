import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { response_Message, User } from 'src/auth/decorator/customize';
import { IUser } from './user.interface';
import { QueryUser } from './dto/query-user.dto';
@ApiTags(api_tags.User)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @response_Message("Tạo User")
@Post()
 async  create(@Body() createUserDto: CreateUserDto , @User() user ) {
    console.log(createUserDto);
    const NewUSer= await  this.usersService.create(createUserDto , user);
    return {
      _id : NewUSer._id,
      createdAt : NewUSer?.createdAt
    }
  }
  @response_Message("Lấy danh sách User")
  @Get()
  @ApiOperation({
    description :"Danh sách user"
  })

  findAll(
    @Query("current") currentPage :string,
    @Query("pageSize") limit : string,
    @Query() qs : QueryUser
  ) {
    return this.usersService.findAll(+currentPage,+limit,qs);
  }
  @response_Message("Lấy danh User theo id")
  @Get(':id') // ứng với router : /:id
  findOne(@Param('id') id: string) {
    // const id : string = req.params.id
    return this.usersService.findOne(id);
  }


  @response_Message("Cập nhật User")
  @Patch()
  @ApiBody({type :UpdateUserDto })
  async update( @Body() updateUserDto: UpdateUserDto , @User() user : IUser) {
    let UpdatedUser = await this.usersService.update( updateUserDto , user);
    return UpdatedUser
  }


  @response_Message("Xóa User")
  @Delete(':id')
  remove(@Param('id') id: string ,@User() user : IUser) {
    return this.usersService.remove(id,user);
  }
}
