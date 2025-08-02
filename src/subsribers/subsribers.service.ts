import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubsriberDto } from './dto/create-subsriber.dto';
import { UpdateSubsriberDto } from './dto/update-subsriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subsribers, SubsribersDocument } from './schemas/subsribers.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class SubsribersService {
  constructor(
    @InjectModel(Subsribers.name)
    private Subscribers : SoftDeleteModel<SubsribersDocument>
  ){}
  async create(createSubsriberDto: CreateSubsriberDto ,user:IUser) {
    const newSub = await this.Subscribers.create({
      ...createSubsriberDto,
      createdBy : {
        _id : user._id,
        email : user.email
      }
    })
    return {
      _id : newSub._id,
      createBdy : newSub.createdAt
    } ;
  }

  async findAll(currentPage,limit,qs) {
  // Parse query string thành filter, sort, populate dùng thư viện aqp
  // filter là phần chinh, thư viện đã làm hết rồi , tự động convert sang moogodb
  let { filter, sort, population} = aqp(qs);

  // Xóa page và limit khỏi filter để tránh ảnh hưởng đến truy vấn MongoDB
  delete filter.current;
  delete filter.pageSize;

  // In ra filter và populate để debug
  console.log("filter",filter);
  let offset = (+currentPage - 1) * (+limit);

  // Nếu limit không hợp lệ thì mặc định là 10
  let defaultLimit = +limit ? +limit : 10;

  // Lấy tổng số bản ghi phù hợp với filter
  // ⚠️ Có thể thay bằng `countDocuments(filter)` để hiệu quả hơn
  const totalItems = (await this.Subscribers.find(filter)).length;

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / defaultLimit);

  // Nếu không có sort thì mặc định sort theo -updatedAt (mới nhất trước)
  if (isEmpty(sort)) {
    // @ts-ignore: Unreachable code error (bỏ qua cảnh báo TS)
    sort = "-updatedAt";
  }

  // Truy vấn danh sách công ty với filter, phân trang, sắp xếp, và populate
  // sử dụng toán tử like 

  const result = await this.Subscribers.find(filter)
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
    const data = await this.Subscribers.findOne({ _id: id });
      
      if (!data) {
        throw new NotFoundException('Không tìm thấy công ty');
      }
      return data
  }

 async update( updateSubsriberDto: UpdateSubsriberDto, user) {
    const updated = await this.Subscribers.updateOne({
      email:user.email
      },
      {
        ...updateSubsriberDto,
        updateBy:{
          _id : user._id,
          email : user.email
        }
      },{
        upsert : true
      }
    )
  }

  async remove(id: string,user: IUser) {
    await this.Subscribers.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user?._id || 1,
          email: user?.email || "Ngô đình phước",
        },
      },
    );
    //isDeleted : true
    return this.Subscribers.softDelete({ _id: id });
  }
  async getSkills(user : IUser){
    const {email} = user ;
    return await this.Subscribers.findOne({email},{skills:1})
  }
}
