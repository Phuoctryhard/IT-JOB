import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  //why lại code contructor :
  // nhờ có  decorator (@InjectModel(User.name) thì biến useModal biết ứng với modal nào : tiêm modal của moogno vào biến userModal đó

  getHashPassword = (passWord) => {
    const salt = genSaltSync(10);
    const hash = hashSync(passWord, salt);
    return hash;
  };
  // tạo mới 1 user
  create(createUserDto: CreateUserDto) {
    // this truy cap den doi tuong userModal
    const createdCat = new this.userModel(createUserDto);
    createdCat.password = this.getHashPassword(createdCat.password);
    createdCat.save();
    return {
      createdCat,
      message: 'Thành công thêm 1 user',
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return this.userModel.findOne({ _id: id });
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, { ...updateUserDto });
  }

  remove(id: string) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return this.userModel.deleteOne({ _id: id });
    }
    return 'Error';
  }
}
