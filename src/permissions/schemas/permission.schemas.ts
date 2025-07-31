import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permisson>;
// chu y thieu decorator Scheme
@Schema({ timestamps: true })
export class Permisson {
  @Prop()
  name: string;
  @Prop()
  apiPath: string;
  @Prop()
  method: string;
  @Prop()
  module : string 
  // tôi nghĩ nên tách thành 1 file 
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
export const PermissonSchema = SchemaFactory.createForClass(Permisson);
