import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { ProfessionDto } from './profession.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsString()
  name?: string;

  companyName?: string;

  workZone?: string | null;

  workLocation?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ enum: ['Conception', 'Execution'] })
  @IsNotEmpty()
  @IsString()
  domain: string;

  @ApiProperty({
    type: [ProfessionDto],
    example: [
      {
        name: 'Developer',
        services: [{ id: '1', name: 'Web Development' }],
        skills: [{ id: '1', name: 'React' }],
        softwares: [{ id: '1', name: 'Vs Code' }],
        yearsOfExperience: { id: '1', name: 'less than 1 year' },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfessionDto)
  professions: ProfessionDto[];
}
