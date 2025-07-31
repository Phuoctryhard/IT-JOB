import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { IUser } from 'src/users/user.interface';
import { response_Message, User } from 'src/auth/decorator/customize';
import { QueryResumes } from './dto/query-resume.dto';

@ApiTags(api_tags.RESUMES)
@ApiBearerAuth("access-token")
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}
  @response_Message("Create a new resume")
  @Post()
  async create(@Body() createResumeDto: CreateResumeDto , @User() user : IUser) {
    const resume = await  this.resumesService.create(createResumeDto,user);
    return {
      _id : resume._id,
      createdAt: resume.createdAt
    }
  }

  // 
  @response_Message("Get Resumes  by User ")
  @Get('/by-user')
  findResumeByUser(@User() user : IUser) {
    return this.resumesService.findResumeUser(user);
  }
  @response_Message("Fetch all resumes with paginate ")
  @Get()
  findAll(@Query('current') currentPage : string , 
      @Query('pageSize') limit : string,
      @Query() qs : QueryResumes
  ) {
    return this.resumesService.findAll(+currentPage,+limit,qs);
  }
  @response_Message("Fetch a resumes  ")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
  @response_Message("Update status resume  ")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto , @User() user : IUser) {
    return this.resumesService.update(id, updateResumeDto,user);
  }
  @response_Message("Delete a resumes  ")
  @Delete(':id')
  remove(@Param('id') id: string , @User() user :IUser) {
    return this.resumesService.remove(id,user);
  }

}
