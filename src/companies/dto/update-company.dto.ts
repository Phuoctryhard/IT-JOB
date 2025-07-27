// import { PartialType } from '@nestjs/mapped-types';
// nên import từ swagger nestjs sẽ sài đc @ApiBody

import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
