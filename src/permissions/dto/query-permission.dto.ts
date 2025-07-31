import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryPermisson{
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
    
      @ApiPropertyOptional({ description: 'Lọc theo tên permission', example: 'ABC' })
      @IsOptional()
      @IsString()
      name?: string;
}