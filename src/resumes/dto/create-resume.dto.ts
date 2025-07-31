import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";

export class CreateResumeDto {
    // hai trường này mình lấy từ tokeb cũng dc
//  @IsString()
//   email: string;

//   @IsMongoId()
//   userId: string;
  
//   @IsOptional()
//   @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
//   status?: string;
  
  // url của cv 
  @IsString()
  @ApiProperty({
    description: "url CV  ",
    example:"6889dd1a539c1c52b5403ecc"
  })
  @IsNotEmpty() // Ensures the string is not empty
  url: string;
    @ApiProperty({
    description: "id company ",
    example:"686e28311ae33968ea1a0f0b"
  })
 @IsNotEmpty() // Ensures the string is not empty
  @IsMongoId()
  companyId: string;
    @ApiProperty({
    description: "id job",
    example:"6889dd1a539c1c52b5403ecc"
  })
  @IsNotEmpty() // Ensures the string is not empty
  @IsMongoId()
  jobId: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => HistoryItemDto)
//   history?: HistoryItemDto[];
}

export class UpdatedByDto {
  @IsMongoId()
  _id: string;

  @IsString()
  email: string;
}

export class HistoryItemDto { 
    @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
    status : string
    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    @ValidateNested()
    @Type(() => UpdatedByDto)
    updatedBy: UpdatedByDto;
}
