import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsEmail({}, { message: 'Không phải là email' })
  @IsNotEmpty()
  email: string;
  @IsNotEmpty({ message: 'Password ko dc rỗng' })
  password: string;
  name: string;
  age: number;
  address: string;
}
