import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResumeDto } from './create-resume.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateResumeDto  {
    @ApiProperty({
        description:"Status Resume",
        example:"PENDING"
    })
    @IsOptional()
    @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
    status?: string;
}

  