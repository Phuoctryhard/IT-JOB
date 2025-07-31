import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, ArrayNotEmpty, IsMongoId } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Tên vai trò', example: 'Admin' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả vai trò', example: 'Quản trị hệ thống' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Trạng thái kích hoạt', example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Danh sách quyền (permission) dưới dạng ObjectId',
    example: ['688b32da90d8c0eed617c92e', '688b273673baf34b87846f01'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  permissions: string[];
}
