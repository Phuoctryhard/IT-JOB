import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schemas';
import { Jobs } from 'src/jobs/schemas/jobs.schemas';
// sử dụng cho softDelete
export type ResumesDocument = HydratedDocument<Resumes>;
//Sử dụng @Schema({ timestamps: true }) để tự động thêm createdAt và updatedAt.
@Schema({ timestamps: true })
export class Resumes {
  @Prop()
  email: string;
 @Prop({ type: mongoose.Schema.Types.ObjectId }) // ✅ dùng mảng chuỗi
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string
  // PENDING - REVIEWING - APPREVED - REJECTED
  @Prop({
    enum : ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  })
  status : string
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Jobs.name })
  jobId: mongoose.Schema.Types.ObjectId;


  @Prop([
    {
      status: { type: String, enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'] },
      updatedAt: { type: Date },
      updatedBy: {
        _id: { type: mongoose.Schema.Types.ObjectId },
        email: String,
      },
    },
  ])
  history :{  
    status : string,
    updatedAt : Date,
    updatedBy : {
      _id: mongoose.Schema.Types.ObjectId;
      email: string;
    }
  }[]
  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  updateBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deleteBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  createBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
   @Prop()
  updatedAt: Date;
  @Prop()
  createdAt: Date;
}
export const ResumesSchema = SchemaFactory.createForClass(Resumes);
