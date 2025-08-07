import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './schemas/roles.schemas';
import { IUser } from 'src/users/user.interface';
// import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { RoleEnum } from 'src/constants/role';

@Injectable()
export class RolesService {
   constructor(
      @InjectModel(Role.name)
      private RolesModel: SoftDeleteModel<RoleDocument>,
    ) {}
  create(createRoleDto: CreateRoleDto , user : IUser) {
  
    // trả về đối tượng được định dạng theo Scheme
    return this.RolesModel.create({
      ...createRoleDto,
      createBy: {
        _id: user?._id || null,
        email: user?.email || null,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs) {
  const aqp = (await import('api-query-params')).default;
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
  const totalItems = (await this.RolesModel.find(filter)).length;

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / defaultLimit);

  // Nếu không có sort thì mặc định sort theo -updatedAt (mới nhất trước)
  if (isEmpty(sort)) {
    // @ts-ignore: Unreachable code error (bỏ qua cảnh báo TS)
    sort = "-updatedAt";
  }

  // Truy vấn danh sách công ty với filter, phân trang, sắp xếp, và populate
  // sử dụng toán tử like 

  const result = await this.RolesModel.find(filter)
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
  const data = await this.RolesModel.findOne({ _id: id }).populate({
    path : "permissions",
    select:{
      _id: 1,
      apiPath :1 ,
      name : 1,
      method:1,
      module :1
    }
  });
  
  if (!data) {
    throw new NotFoundException('Không tìm thấy công ty');
  }
  return data

}

 async update(id: string, updateRole: UpdateRoleDto, user: IUser) {
  // Kiểm tra nếu name bị thay đổi
  if (updateRole.name) {
    const existed = await this.RolesModel.findOne({
      name: updateRole.name,
      _id: { $ne: id }, // loại trừ chính nó
    });

    if (existed) {
      throw new BadRequestException('Tên vai trò đã tồn tại.');
    }
  }

  return this.RolesModel.updateOne(
    { _id: id },
    {
      ...updateRole,
      updateBy: {
        _id: user?._id || 1,
        email: user?.email || 'Ngô đình phước',
      },
    },
  );
}

async remove(id: string, user: IUser) {
  const role = await this.RolesModel.findById(id);

  if (!role) {
    throw new BadRequestException('Role không tồn tại');
  }

  if (role.name === RoleEnum.ADMIN) {
    throw new BadRequestException('Không được phép xóa role Admin');
  }

  // Cập nhật người xóa
  await this.RolesModel.updateOne(
    { _id: id },
    {
      deleteBy: {
        _id: user?._id || 1,
        email: user?.email || 'Ngô đình phước',
      },
    },
  );

  // Soft delete (isDeleted: true + deletedAt)
  return this.RolesModel.softDelete({ _id: id });
}
}
