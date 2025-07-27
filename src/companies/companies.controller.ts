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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { QueryCompany } from './dto/query-company.dto';
@ApiTags(api_tags.Company)
@ApiBearerAuth('access-token') // 👈 trùng với tên ở .addBearerAuth()
@Controller('companies')
@Public()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  // them coong ty
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto,user);
  }

  @Get()
  //   @ApiOperation({ summary: 'Lấy danh sách công ty có phân trang và lọc nâng cao' })
  // @ApiQuery({ name: 'page', required: false, example: 1, description: 'Trang hiện tại (bắt đầu từ 1)' })
  // @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Số lượng mục trên mỗi trang' })
  // @ApiQuery({ name: 'name', required: false, example: 'ABC', description: 'Lọc theo tên công ty' })
  // @ApiQuery({ name: 'sort', required: false, example: '-createdAt', description: 'Sắp xếp' })
  // @ApiQuery({ name: 'populate', required: false, example: 'owner', description: 'Quan hệ cần populate' })
  findAll(@Query('page') currentPage : string , 
  @Query('limit') limit : string,
  @Query() qs : QueryCompany,
)  {
    return this.companiesService.findAll(+currentPage,+limit,qs);
  }
  @Get(':id')
    @ApiParam({
    name :'id',
    required: true,
    description: 'ID của công ty cần cập nhật',
    example: '686e31205a7ab658c280615e', // ví dụ ID Mongo
  })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({summary: "Cập nhật Công Ty"})
  @ApiParam({
    name :'id',
    required: true,
    description: 'ID của công ty cần cập nhật',
    example: '686e31205a7ab658c280615e', // ví dụ ID Mongo
  })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    // user = user.req
    console.log(user);
    return this.companiesService.remove(id, user);
  }
}
