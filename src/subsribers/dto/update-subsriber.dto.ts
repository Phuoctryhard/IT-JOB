import { PartialType } from '@nestjs/swagger';
import { CreateSubsriberDto } from './create-subsriber.dto';

export class UpdateSubsriberDto extends PartialType(CreateSubsriberDto) {}
