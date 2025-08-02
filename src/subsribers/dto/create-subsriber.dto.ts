import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsString } from "class-validator";


export class CreateSubsriberDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email của người đăng ký' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người đăng ký' })
  @IsString()
  name: string;

  @ApiProperty({ example: ['Node.js', 'React'], description: 'Danh sách kỹ năng' })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
