import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User  as UserM} from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { IUser } from './user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
@Injectable()
export class UsersService {
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) {}
  //why lại code contructor :
  // nhờ có  decorator (@InjectModel(User.name) thì biến useModal biết ứng với modal nào : tiêm modal của moogno vào biến userModal đó

  getHashPassword = (passWord) => {
    const salt = genSaltSync(10);
    const hash = hashSync(passWord, salt);
    return hash;
  };
  // tạo mới 1 user
  async create(createUserDto: CreateUserDto , user) {

     // this truy cap den doi tuong userModal
    const {name , email,password , age , gender , address , role , company} = createUserDto
    const IxistEmail = await this.userModel.findOne({email})
    if(IxistEmail){
      throw new BadRequestException(`Email ${email} đã được sử dụng !`)
    }
   
    const hashpassword= this.getHashPassword(password);
    let newUser = await this.userModel.create({
      name , email,password:hashpassword,
      gender,age,address,role,company,
      createBy : {
        _id : user._id,
        email :   user.email
      }
    })
    return  newUser
  }

  // register modal 

  async register(user: RegisterUserDto) {
    // this truy cap den doi tuong userModal
    const {name , email,password , age , gender , address } = user
    // add logic checkemail 
    const IxistEmail = await this.userModel.findOne({email})
    if(IxistEmail){
      throw new BadRequestException(`Email ${email} đã được sử dụng !`)
    }
    const hashpassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name , email,password:hashpassword,
      gender,age,address,role:"USER"
    })
    return newRegister
  }

  async findAll(currentPage : number,limit : number ,qs : string ) {
     let { filter, sort, population,projection } = aqp(qs);

  // Xóa page và limit khỏi filter để tránh ảnh hưởng đến truy vấn MongoDB
  delete filter.page;
  delete filter.limit;

  // In ra filter và populate để debug
  console.log(filter);
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
  const totalItems = (await this.userModel.find(filter)).length;

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / defaultLimit);

  // Nếu không có sort thì mặc định sort theo -updatedAt (mới nhất trước)
  if (isEmpty(sort)) {
    // @ts-ignore: Unreachable code error (bỏ qua cảnh báo TS)
    sort = "-updatedAt";
  }
  const result = await this.userModel.find(filter)
    .skip(offset) // bỏ qua offset bản ghi
    .limit(defaultLimit) // giới hạn số lượng bản ghi trả về
    // bỏ qua check code typeScipt tại dòng dưới 
    // @ts-ignore: Unreachable code error (bỏ qua lỗi nếu sort sai kiểu)
    .sort(sort) // any everywhere 
    .populate(population) // join bảng 
    .select("-password")
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
  findOne(id: string) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return this.userModel.findOne({ _id: id }).select("-password");
    }
    return 'Error';
  }
  // email
  findOneByUsername(userName: string) {
    return this.userModel.findOne({ email: userName });
  }

  isValidPassword(password, hashpassword) {
    return compareSync(password, hashpassword); // false
  }

  update( updateUserDto: UpdateUserDto , user) {
    const {_id} = updateUserDto
    const updated = this.userModel.updateOne({ _id: _id }, { ...updateUserDto ,
      updateBy: {
        _id : user._id,
        email : user.email
      }
    });
    return updated
  }

 async remove(id: string,user :IUser) {

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await this.userModel.updateOne({ _id: id }, { 
      deleteBy: {
        _id : user._id,
        email : user.email
      }
    });
    return this.userModel.softDelete({
      _id:id
    });
    
    }
  }
   updateUserToken = async(refreshToken,_id)=>{
    return await this.userModel.updateOne({_id:_id},{
      refreshToken
    })
  }
}
