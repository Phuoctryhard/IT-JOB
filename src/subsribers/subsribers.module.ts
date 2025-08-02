import { Module } from '@nestjs/common';
import { SubsribersService } from './subsribers.service';
import { SubsribersController } from './subsribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subsribers, SubsribersSchema } from './schemas/subsribers.schemas';

@Module({
  imports:[MongooseModule.forFeature([{name : Subsribers.name , schema : SubsribersSchema}])],
  controllers: [SubsribersController],
  providers: [SubsribersService]
})
export class SubsribersModule {}
