import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;
// chu y thieu decorator Scheme
@Schema({ timestamps: true })
export class Company {
  @Prop()
  name: string;
  @Prop()
  address: string;
  @Prop()
  description: string;

  @Prop()
  isDeleted: boolean;
  @Prop()
  updateAt: Date;
  @Prop()
  createAt: Date;
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
export const CompanySchema = SchemaFactory.createForClass(Company);
