import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Headers, BadRequestException } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { api_tags } from 'src/constants/api_tag';
import { Public } from 'src/auth/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@ApiTags(api_tags.FILES)
@ApiBearerAuth('access-token')
@Controller('files')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

@Public()
@Post('/upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  @ApiOperation({ summary: 'Upload an image with folder_type header' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image upload form',
    schema: {
      type: 'object',
      properties: {
        hoidanit: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
   @ApiHeader({
    name: 'folder_type',
    description: 'Folder name to categorize image (e.g. hoidanit)',
    required: true,
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File ,@Headers('folder_type') folderType: string,) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('Chỉ cho phép ảnh JPG, PNG hoặc file PDF');
  }
  if (!folderType) {
      throw new BadRequestException('Thiếu header folder_type');
    }
    const dataImage =  await this.cloudinaryService.uploadFile(file, folderType);
    return {
      url: dataImage.url,
      public_id : dataImage.public_id
    }
  }
  @Get()
  findAll() {
    return this.uploadFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadFileDto: UpdateUploadFileDto) {
    return this.uploadFileService.update(+id, updateUploadFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadFileService.remove(+id);
  }
}
