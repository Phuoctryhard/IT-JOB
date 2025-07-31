import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class CompanyDto {
  @ApiProperty({ example: '64b7c7c3d9f3c2a1d2e4b9aa', description: 'ID của công ty' })
  @IsString()
  _id: string;

  @ApiProperty({ example: 'ABC Corporation', description: 'Tên công ty' })
  @IsString()
  name: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email người dùng' })
  @IsEmail({}, { message: 'Không phải là email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Password không được rỗng' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Họ tên người dùng' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 25, description: 'Tuổi người dùng' })
  @IsNumber()
  age: number;

  @ApiProperty({ example: '123 Main St', description: 'Địa chỉ' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'male', description: 'Giới tính', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ type: CompanyDto, description: 'Thông tin công ty', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;

  @ApiProperty({ example: '688b32e790d8c0eed617c930', description: 'ID Vai trò của người dùng', required: false })
  @IsOptional()
  @IsMongoId({message:"Role có định dạng moogodb"})
  role?: mongoose.Schema.Types.ObjectId;
}



export class RegisterUserDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email của người dùng',
  })
  @IsEmail({}, { message: 'Không phải là email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Mật khẩu tài khoản',
  })
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ và tên người dùng',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 25,
    description: 'Tuổi người dùng',
    required: false,
  })
  age: number;

  @ApiProperty({
    example: '123 Đường ABC, TP.HCM',
    description: 'Địa chỉ nơi ở',
    required: false,
  })
  address: string;

  @ApiProperty({
    example: 'male',
    description: 'Giới tính (male, female, other)',
    required: false,
  })
  gender: string;
}


export class Login {
    @ApiProperty({
    example: 'vsdxasmple@gmail.com',
    description: 'Email của người dùng',
  })
  @IsEmail({}, { message: 'Không phải là email' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Mật khẩu tài khoản',
  })
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;
}