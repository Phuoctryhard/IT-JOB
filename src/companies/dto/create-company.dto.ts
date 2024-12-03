import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name ko dc rỗng' })
  name: string;

  @IsNotEmpty({ message: 'address ko dc rỗng' })
  address: string;

  @IsNotEmpty({ message: 'Description ko dc rỗng' })
  description: string;
}
