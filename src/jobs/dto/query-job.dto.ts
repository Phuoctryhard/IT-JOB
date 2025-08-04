import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryJobs {
  @ApiPropertyOptional({ description: 'Trang hiện tại (bắt đầu từ 1)', example: '1' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng mục trên mỗi trang', example: '10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: 'Lọc theo tên kĩ năng', example: ['React.JS','Node.JS'] ,type: [String]}) // đảm bảo Swagger hiểu đây là mảng chuỗi})
  @IsOptional()
  @IsArray()
  @IsString({each:true})
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  skills?: string[];

   @ApiPropertyOptional({
    description: 'Lọc theo vị trí',
    example: ['Đà Nẵng', 'HOCHIMINH'],
    type: [String], // đảm bảo Swagger hiểu đây là mảng chuỗi
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  location?: string[];

  @ApiPropertyOptional({ description: 'Sắp xếp', example: '-createdAt' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ description: 'Quan hệ cần populate', example: 'owner' })
  @IsOptional()
  @IsString()
  populate?: string;
}