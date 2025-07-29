import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto,['password']){
    @ApiProperty({
    description: 'ID của người dùng cần cập nhật',
    example: '64c6f8f3eac7f4e5e8d9c1a7',
  })
    @IsNotEmpty({message : "id không được để trống "})
    _id : string
}

