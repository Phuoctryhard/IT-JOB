import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private CompanyModel: SoftDeleteModel<CompanyDocument>,
  ) {}
  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    console.log(createCompanyDto);
    // trả về đối tượng được định dạng theo Scheme
    return this.CompanyModel.create({
      ...createCompanyDto,
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });
    // return createCompanyDto;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.CompanyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    // xóa cứng
    // return this.CompanyModel.deleteOne({ _id: id });

    // xóa mêm + them việc cập nhật  deleteBy
    await this.CompanyModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.CompanyModel.softDelete({ _id: id });
  }
}
