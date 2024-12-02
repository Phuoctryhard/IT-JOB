import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');

@Module({
  imports: [
    UsersModule,

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      // config servive vs moongo
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MoongoDB'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
