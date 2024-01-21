import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class FieldDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
