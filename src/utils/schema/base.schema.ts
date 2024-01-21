import { Prop, Schema } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class BaseSchema {
  @Transform(
    (value) => {
      if ('value' in value) {
        return value.obj[value.key].toString();
      }
      return 'unknown value';
    },
    { toPlainOnly: true },
  )
  public _id: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
