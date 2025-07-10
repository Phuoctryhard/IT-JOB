import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('IT JOB')
    .setDescription('The IT JOB API description')
    .setVersion('1.0')
    .addTag('IT Jobs ')
    .addServer('http://localhost:3000')
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
  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(port);
}
bootstrap();
