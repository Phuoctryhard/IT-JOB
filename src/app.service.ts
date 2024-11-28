import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    //code model ở đây
    return 'Hello World ngo dsinh phuoc ';
  }
}
