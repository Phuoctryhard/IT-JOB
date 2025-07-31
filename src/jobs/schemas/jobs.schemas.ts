import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobsDocument = HydratedDocument<Jobs>;
// chu y thieu decorator Scheme
@Schema({ timestamps: true })
export class Jobs {
  @Prop()
  name: string;
 @Prop({ type: [String] }) // ✅ dùng mảng chuỗi
  skills: string[];
  @Prop({ type: Object })
  company: {
    _id : mongoose.Schema.Types.ObjectId,
    name : string
  };
  @Prop()
  location: string;
  @Prop()
  salary: string;

  @Prop()
  quantity: string;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;
  
  @Prop()
  isActive: boolean;

  @Prop()
  isDeleted: boolean;
  @Prop()
  updatedAt: Date;
  @Prop()
  createdAt: Date;
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
  
}
export const JobsSchema = SchemaFactory.createForClass(Jobs);
