import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryRoles {
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

  @ApiPropertyOptional({ description: 'Lọc theo tên công ty', example: 'ABC' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Lọc theo địa chỉ công ty', example: 'ABC' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Sắp xếp', example: '-createdAt' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ description: 'Quan hệ cần populate', example: 'companyId,jobId' })
  @IsOptional()
  @IsString()
  populate?: string;
  //// projector 
  @ApiPropertyOptional({ description: "select fields ", example: 'companyId._id,companyId.name,companyId.logo,jobId._id,jobId.name' })
  @IsOptional()
  @IsString()
  fields?: string;
}