import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Tên quyền', example: 'Create User' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Đường dẫn API', example: '/api/v1/users' })
  @IsString()
  apiPath: string;

  @ApiProperty({ description: 'Phương thức HTTP', example: 'POST' })
  @IsString()
  method: string;

  @ApiProperty({ description: 'Tên module chức năng', example: 'User Management' })
  @IsString()
  module: string;
}
