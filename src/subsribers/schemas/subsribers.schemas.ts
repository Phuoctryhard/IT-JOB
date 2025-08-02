import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schemas';
import { Jobs } from 'src/jobs/schemas/jobs.schemas';
// sử dụng cho softDelete
export type SubsribersDocument = HydratedDocument<Subsribers>;
//Sử dụng @Schema({ timestamps: true }) để tự động thêm createdAt và updatedAt.
@Schema({ timestamps: true })
export class Subsribers {

  @Prop()
  email: string;
  @Prop() // ✅ dùng mảng chuỗi
  name: string;
  @Prop()
  skills: string[]

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
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
   @Prop()
  updatedAt: Date;
  @Prop()
  createdAt: Date;
}
export const SubsribersSchema = SchemaFactory.createForClass(Subsribers);
