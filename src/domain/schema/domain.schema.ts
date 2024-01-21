import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/utils/schema';

export type DomainSchemaDocument = HydratedDocument<Domain>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Domain extends BaseSchema {
  @Prop({
    type: String,
    unique: true,
  })
  name: string | null;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
