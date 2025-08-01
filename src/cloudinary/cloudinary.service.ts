import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response'; // Interface này mô tả dữ liệu trả về từ Cloudinary
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // ✅ 1. Giới hạn file tối đa 2MB
      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        return reject(
          new BadRequestException(
            `File size exceeds limit of ${maxFileSize / (1024 * 1024)}MB`,
          ),
        );
      }

      // ✅ 2. Kiểm tra xem file có phải PDF không
      const isPdf =
        file.mimetype === 'application/pdf' ||
        file.originalname.toLowerCase().endsWith('.pdf');

      // Nếu là PDF thì resource_type phải là 'raw'
      const resourceType = isPdf ? 'raw' : 'image';

      // ✅ 3. Tạo stream upload lên Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          use_filename: true,           // Giữ tên gốc
          unique_filename: false,       // Không thêm random string
          type: 'upload',
        },
        (error, result) => {
          if (error) return reject(error);

          // ✅ 4. Nếu là PDF, sửa secure_url để hiển thị inline (không tải về)
          if (isPdf && result?.secure_url) {
            result.secure_url = result.secure_url.replace(
              '/upload/',
              '/upload/fl_attachment:false/',
            );
          }

          // ✅ 5. Trả về toàn bộ response Cloudinary
          resolve(result as CloudinaryResponse);
        },
      );

      // ✅ 6. Gửi dữ liệu file vào stream upload
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    }).catch((error) => {
      throw new InternalServerErrorException(
        'File upload failed',
        error.message,
      );
    });
  }
}
