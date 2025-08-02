import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubsribersService } from './subsribers.service';
import { CreateSubsriberDto } from './dto/create-subsriber.dto';
import { UpdateSubsriberDto } from './dto/update-subsriber.dto';
import { IUser } from 'src/users/user.interface';
import { IS_PUBLIC_PERMISSION, response_Message, User } from 'src/auth/decorator/customize';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { QuerySubsriber } from './dto/query-subscriber.dto';


@ApiTags(api_tags.SUBSCRIBERS)
@ApiBearerAuth("access-token")
@Controller('subscribers')
export class SubsribersController {
  constructor(private readonly subsribersService: SubsribersService) {}
  
  @response_Message("Get subscribers's skill")
  @IS_PUBLIC_PERMISSION()
  @Post("skills")
  getUserSkill(@User() user : IUser){
    return this.subsribersService.getSkills(user)
  }
  @response_Message("Tạo Subscriber thành công")
  @IS_PUBLIC_PERMISSION()
  @Post()
  create(@Body() createSubsriberDto: CreateSubsriberDto,@User() user : IUser) {
    return this.subsribersService.create(createSubsriberDto,user);
  }

    @response_Message("Lấy danh sách thành công")
    @IS_PUBLIC_PERMISSION()
    @Get()
    findAll(@Query('current') currentPage : string , 
    @Query('pageSize') limit : string,
    @Query() qs : QuerySubsriber) {
    return this.subsribersService.findAll(+currentPage,+limit,qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subsribersService.findOne(id);
  }
  @response_Message("Cập nhật thành công")
  @IS_PUBLIC_PERMISSION()
  @Patch()
  update( @Body() updateSubsriberDto: UpdateSubsriberDto , @User()user : IUser) {
    return this.subsribersService.update( updateSubsriberDto,user);
  }
  @response_Message("Xóa thành công")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user : IUser) {
    return this.subsribersService.remove(id,user);
  }
}
