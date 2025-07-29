import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';


import { Public, RESPONSE_MESSAGE, response_Message, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';

import { AuthService } from './auth.service';
import { Login, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
@ApiTags(api_tags.AUTH)
@ApiBearerAuth('access-token') // 👈 trùng với tên ở .addBearerAuth()
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly companiesService: AuthService) {}
  @response_Message("Register a new user")
  @Post('/register')
  create(@Body() createCompanyDto: RegisterUserDto, @User() user: IUser) {
    return this.companiesService.register(createCompanyDto);
  }

  @response_Message("User Login")
  @Post('/login')
  login(@Body() login: Login ,@Res({ passthrough: true }) response: Response) {
    return this.companiesService.login(login,response);
  }

//   @response_Message("Lấy danh sách thành công")
//   @Get()
//   //   @ApiOperation({ summary: 'Lấy danh sách công ty có phân trang và lọc nâng cao' })
//   // @ApiQuery({ name: 'page', required: false, example: 1, description: 'Trang hiện tại (bắt đầu từ 1)' })
//   // @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Số lượng mục trên mỗi trang' })
//   // @ApiQuery({ name: 'name', required: false, example: 'ABC', description: 'Lọc theo tên công ty' })
//   // @ApiQuery({ name: 'sort', required: false, example: '-createdAt', description: 'Sắp xếp' })
//   // @ApiQuery({ name: 'populate', required: false, example: 'owner', description: 'Quan hệ cần populate' })
//   findAll(@Query('page') currentPage : string , 
//   @Query('limit') limit : string,
//   @Query() qs : QueryCompany,
// )  {
//     return this.companiesService.findAll(+currentPage,+limit,qs);
//   }
}