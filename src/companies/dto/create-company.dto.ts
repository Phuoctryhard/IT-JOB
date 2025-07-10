import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
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
}
