import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // chạy trên cổng 3000
  app.useStaticAssets(join(__dirname, '..', 'public')); // js,css , images
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
 
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  // set up cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  const reflector = app.get(Reflector);
   // intercepter 
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  // app.useGlobalInterceptors(new ResponseInterceptor());
  
  // somewhere in your initialization file
  app.use(cookieParser());


  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('IT JOB')
    .setDescription('The IT JOB API description')
    .setVersion('1.0')
    .addTag('IT Jobs ')
    .addServer('http://localhost:3000/api/v1')
     .addServer('http://localhost:3000/api/v2')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Nhập JWT token vào đây',
      in: 'header',
    },
    'access-token', // => Đây là tên để tham chiếu
  )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory());

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'api/v1', method: RequestMethod.ALL }],
  });

  // Enable versioning via URI (/v1/users)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });
  await app.listen(port);
}
bootstrap();
