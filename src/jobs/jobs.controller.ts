import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { response_Message, User } from 'src/auth/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { QueryJobs } from './dto/query-job.dto';

@ApiTags(api_tags.JOBS)
@ApiBearerAuth('access-token') // 👈 trùng với tên ở .addBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  @response_Message("Create a new jobs")
  @ApiOperation({
    description:"Tạo Jobs"
  })
  @Post()
  async create(@Body() createJobDto: CreateJobDto , @User() user : IUser) {
    const jobs =  await this.jobsService.create(createJobDto,user);
    return {
      _id:jobs._id,
      createdAt : jobs.createdAt
    }
  }
 @response_Message("List new jobs")
  @ApiOperation({
    description:"Lấy danh sách Jobs"
  })
  @Get()
  findAll(@Query("current")currentPage : string, @Query("pageSize") pageSize : string , @Query() qs :QueryJobs )   {
    return this.jobsService.findAll(+currentPage, +pageSize, qs);
  }
  @response_Message("Get a  new jobs")
  @ApiOperation({
    description:"Lấy a  Jobs"
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
 @response_Message("Update a job")
  @ApiOperation({
    description:"Cập nhật  Jobs"
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto , @User() user) {
    return this.jobsService.update(id, updateJobDto ,user);
  }
@response_Message("Xóa mềm a job")
  @ApiOperation({
    description:"Xóa mềm a Job"
  })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user) {
    return this.jobsService.remove(id,user);
  }
}
