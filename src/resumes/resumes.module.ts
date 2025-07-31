import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Company, CompanySchema } from 'src/companies/schemas/company.schemas';
import { Jobs, JobsSchema } from 'src/jobs/schemas/jobs.schemas';
import { Resumes, ResumesSchema } from './schemas/resumes.schemas';

@Module({
  imports:[MongooseModule.forFeature([{name : Resumes.name,schema : ResumesSchema},
     { name: Company.name, schema: CompanySchema },
  { name: Jobs.name, schema: JobsSchema }

])],
  controllers: [ResumesController],
  providers: [ResumesService]
})
export class ResumesModule {}
