import { Prop } from '@nestjs/mongoose';

export class Field {
  @Prop({ type: String, unique: true })
  id: string;

  @Prop({ type: String, unique: true })
  name: string;
}

export class Profession {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ type: [Field] })
  services: Field[];

  @Prop({ type: [Field] })
  skills: Field[];

  @Prop({ type: [Field] })
  softwares: Field[] | null;

  @Prop({ type: Field })
  yearsOfExperience: Field;
}
