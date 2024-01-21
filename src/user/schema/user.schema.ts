import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/utils/schema';
import { Profession } from './profession.schema';

export type UserSchemaDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class User extends BaseSchema {
  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ toPlainOnly: true })
  email: string | null;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  name: string | null;

  @Prop({
    type: String,
  })
  companyName: string | null;

  @Prop({ type: String, enum: ['Conception', 'Execution'] })
  domain: string;

  @Prop({ type: String })
  workLocation: string | null;

  @Prop({ type: String })
  workZone: string | null;

  @Prop({
    type: [Profession],
  })
  professions: Profession[];

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
