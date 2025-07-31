import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './entities/resume.entity';
import { Resumes, ResumesDocument } from './schemas/jobs.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { Types } from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resumes.name)
    private ResumesModel : SoftDeleteModel<ResumesDocument>
  ){}
  create(createResumeDto: CreateResumeDto , user : IUser) {
    return this.ResumesModel.create({
      ...createResumeDto,
      email : user.email,
      userId : user._id,
      status : "PENDING",
      history:[{
        status : "PENDING",
        updatedAt : new Date(),
        updatedBy : {
          _id : user._id,
          email : user.email
        }
      }],
      createdBy : {
        _id : user._id,
        email : user.email
      }
    });
  }

  async findAll(currentPage: number, limit: number, qs) {

  // Parse query string thành filter, sort, populate dùng thư viện aqp
  // filter là phần chinh, thư viện đã làm hết rồi , tự động convert sang moogodb
  let { filter, sort, population} = aqp(qs);

  // Xóa page và limit khỏi filter để tránh ảnh hưởng đến truy vấn MongoDB
  delete filter.current;
  delete filter.pageSize;

  // In ra filter và populate để debug
  console.log("filter",filter);
  // 👉 Biến các trường string thành regex nếu muốn "search like"  || phía FE sử lý url cũng dc /value/i
  // if (filter.name) {
  //   filter.name = { $regex: filter.name, $options: 'i' }; // like không phân biệt hoa thường
  // }
  // Tính toán offset cho phân trang (bỏ qua bao nhiêu bản ghi)
  let offset = (+currentPage - 1) * (+limit);

  // Nếu limit không hợp lệ thì mặc định là 10
  let defaultLimit = +limit ? +limit : 10;

  // Lấy tổng số bản ghi phù hợp với filter
  // ⚠️ Có thể thay bằng `countDocuments(filter)` để hiệu quả hơn
  const totalItems = (await this.ResumesModel.find(filter)).length;

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / defaultLimit);

  // Nếu không có sort thì mặc định sort theo -updatedAt (mới nhất trước)
  if (isEmpty(sort)) {
    // @ts-ignore: Unreachable code error (bỏ qua cảnh báo TS)
    sort = "-updatedAt";
  }

  // Truy vấn danh sách công ty với filter, phân trang, sắp xếp, và populate
  // sử dụng toán tử like 

  const result = await this.ResumesModel.find(filter)
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
    const data = await this.ResumesModel.findOne({ _id: id });
    
    if (!data) {
      throw new NotFoundException('Không tìm thấy CV ');
    }
    return data
  
  }

 async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
  return await this.ResumesModel.updateOne(
    { _id: id },
    {
      $set: {
        ...updateResumeDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      $push: {
        history: {
          status: updateResumeDto.status,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    }
  );
}


    async remove(id: string, user: IUser) {
    // xóa cứng
    // return this.CompanyModel.deleteOne({ _id: id });

    // xóa mêm + them việc cập nhật  deleteBy
    await this.ResumesModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user?._id || 1,
          email: user?.email || "Ngô đình phước",
        },
      },
    );
    //isDeleted : true
    return this.ResumesModel.softDelete({ _id: id });
  }
  async findResumeUser(user : IUser) {
    // const userId = new Types.ObjectId(user._id.toString()); // ép kiểu an toàn
    const data = await this.ResumesModel.findOne({ userId : user._id });
    if (!data) {
      throw new NotFoundException('Không tìm thấy CV của User ');
    }
    return data
  }
}
