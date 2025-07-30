import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsNumber, isObject, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateJobDto {
     @ApiProperty({
        description : "Tên công việc",
        example:"Backend Developer"
     })
     @IsString()
      name: string;
     @ApiProperty({  example: ['NestJS', 'MongoDB'], description: 'Kỹ năng yêu cầu', type: [String] })
     @IsArray()
      @ArrayNotEmpty()
     @IsString({each : true}) // mỗi phần tử trong mãng là chuỗi
     @Type(() => String)
      skills: string[];
      
      @ApiProperty({
        description:"Công ty ",
        example:{
            _id : "1",
            name : "Công ty a"
        }
      })
      @IsObject() 
     company: {
        _id : Types.ObjectId,
        name : string
      }
  @ApiProperty({ example: 'Đà Nẵng', description: 'Địa điểm làm việc' })
  @IsString()
  location: string;

  @ApiProperty({ example: 1000, description: 'Mức lương' })
  @IsNumber()
  salary: number;

  @ApiProperty({ example: 5, description: 'Số lượng tuyển' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'Junior', description: 'Cấp độ công việc' })
  @IsString()
  level: string;

@ApiProperty({
    example: '<p><strong>Mô tả:</strong> Phát triển hệ thống bằng NestJS.</p>',
    description: 'Mô tả công việc (HTML string)',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-08-01', description: 'Ngày bắt đầu (yyyy-mm-dd)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-08-30', description: 'Ngày kết thúc (yyyy-mm-dd)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true, description: 'Công việc còn hoạt động hay không' })
  @IsBoolean()
  isActive: boolean;
  @ApiProperty({ example: "https://www.google.com.vn/url?sa=i&url=https%3A%2F%2Fvi.pngtree.com%2Ffree-logo-png%2Fcompany-logo&psig=AOvVaw2GVjwyFafFW_1neo_YIdv6&ust=1753955384836000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNj3vY-n5I4DFQAAAAAdAAAAABAE", description: 'Url ảnh' })
  @IsString()
  logo : string
}
