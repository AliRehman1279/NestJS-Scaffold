import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { FieldDto } from './field.dto';
import { Type } from 'class-transformer';

export class ProfessionDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @ApiProperty()
  services: FieldDto[];

  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @ApiProperty()
  skills: FieldDto[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @ApiProperty()
  softwares: FieldDto[];

  @ValidateNested()
  @Type(() => FieldDto)
  @ApiProperty()
  yearsOfExperience: FieldDto;
}
