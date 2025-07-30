import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateCompanyDto {

  @IsNotEmpty({ message: 'Name ko dc rỗng' })
  @ApiProperty({
    description : "name",
    example:"Ngô đình phuoc"
  })
  name: string;

 @IsNotEmpty({ message: 'Address không được rỗng' })
  @ApiProperty({
    description: 'Địa chỉ công ty',
    example: '123 Lê Văn Việt, Quận 9, TP.HCM',
  })
  address: string;

  @IsNotEmpty({ message: 'Description không được rỗng' })
  @ApiProperty({
    description: 'Mô tả về công ty',
    example: 'Cung cấp giải pháp phần mềm và dịch vụ IT toàn diện',
  })
  description: string;

  @ApiProperty({ example: "https://png.pngtree.com/element_pic/16/11/03/dda587d35b48fd01947cf38931323161.jpg", description: 'Url ảnh' })
  @IsString()
  logo : string
}
