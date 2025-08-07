import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Jobs, JobsDocument } from './schemas/jobs.schemas';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
// import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Jobs.name) private JobsModel: SoftDeleteModel<JobsDocument>){}
  async create(createJobDto: CreateJobDto,user) {
  return await this.JobsModel.create({
        ...createJobDto,
        createBy: {
          _id: user?._id || null,
          email: user?.email || null,
        },
      });
  }

   async findAll(currentPage: number, limit: number, qs) {
     const aqp = (await import('api-query-params')).default;
  let { filter, sort, population} = aqp(qs);
  // Xóa page và limit khỏi filter để tránh ảnh hưởng đến truy vấn MongoDB
  delete filter.current;
  delete filter.pageSize;
  // In ra filter và populate để debug
  console.log("filter",filter);
  let offset = (+currentPage - 1) * (+limit);
  let defaultLimit = +limit ? +limit : 10;
  const totalItems = (await this.JobsModel.find(filter)).length;
  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / defaultLimit);
  // Nếu không có sort thì mặc định sort theo -updatedAt (mới nhất trước)
  if (isEmpty(sort)) {
    // @ts-ignore: Unreachable code error (bỏ qua cảnh báo TS)
    sort = "-updatedAt";
  }
  // "skills": {
  //     "$in": [
  //       "React.JS",
  //       "Node.JS"
  //     ]
  //   },
  //   "location": {
  //     "$in": [
  //       "Đà Nẵng",
  //       "HOCHIMINH"
  //     ]
  //   }
  // Truy vấn danh sách công ty với filter, phân trang, sắp xếp, và populate
  const result = await this.JobsModel.find(filter)
    .skip(offset) // bỏ qua offset bản ghi
    .limit(defaultLimit) // giới hạn số lượng bản ghi trả về
    // bỏ qua check code typeScipt tại dòng dưới 
    // @ts-ignore: Unreachable code error (bỏ qua lỗi nếu sort sai kiểu)
    .sort(sort) // any everywhere 
    .populate(population) // join bảng 
    .exec(); // thực thi query
  return {
    meta: {
    current: currentPage, //trang hiện tại
    pageSize: limit, //số lượng bản ghi đã lấy
    pages: totalPages, //tổng số trang với điều kiện query
    total: totalItems // tổng số phần tử (số bản ghi)
    },
    result
  }
}

  async findOne(id: string) {
    return await this.JobsModel.findById({_id:id});
  }

  update(id: string, updateJobDto: UpdateJobDto , user : IUser) {
   return this.JobsModel.updateOne({
    _id:id
    // Luôn dùng $set khi update một phần document.
   },{$set:{
    ...updateJobDto,
     updateBy: {
          _id: user?._id || 1,
          email: user?.email || "Ngô đình phước",
        },
   }})
  }

  async remove(id: string ,user : IUser) {
    await this.JobsModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user?._id || 1,
          email: user?.email || "Ngô đình phước",
        },
      },
    );
    //isDeleted : true
    return this.JobsModel.softDelete({ _id: id });
  }
}
