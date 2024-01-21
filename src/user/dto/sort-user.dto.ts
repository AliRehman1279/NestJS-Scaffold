import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SortUserDto {
  @ApiProperty()
  @IsString()
  orderBy: string;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterUserDto {
  @ApiProperty()
  @IsString()
  @IsIn(['Conception', 'Execution'])
  domain: string;
}

export class QueryUserDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @ApiProperty({ type: FilterUserDto, required: false })
  @IsOptional()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto;

  @ApiProperty({ type: SortUserDto, isArray: true, required: false })
  @IsOptional()
  @Type(() => SortUserDto)
  sort?: SortUserDto[];
}
