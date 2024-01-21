import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { UserConstants } from './constants';
import { pagination } from 'src/utils/helpers/pagination.helper';
import { PaginationResultType } from 'src/utils/types';

@ApiTags(UserConstants.USER_CONTROLLER_TAG)
@Controller(UserConstants.USER_CONTROLLER_PATH)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.create(user);
    return createdUser;
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiParam({
    name: UserConstants.USER_ID_PARAM_NAME,
    description: UserConstants.USER_ID_PARAM_DESCRIPTION,
  })
  @Get(`:${UserConstants.USER_ID_PARAM_NAME}`)
  @HttpCode(HttpStatus.OK)
  findById(
    @Param(UserConstants.USER_ID_PARAM_NAME) id: string,
  ): Promise<User | null> {
    return this.userService.findById(id);
  }

  @ApiParam({
    name: UserConstants.USER_ID_PARAM_NAME,
    description: UserConstants.USER_ID_PARAM_DESCRIPTION,
  })
  @Put(`:${UserConstants.USER_ID_PARAM_NAME}`)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param(UserConstants.USER_ID_PARAM_NAME) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await this.userService.update(id, user);
    return updatedUser;
  }

  @ApiParam({
    name: UserConstants.USER_ID_PARAM_NAME,
    description: UserConstants.USER_ID_PARAM_DESCRIPTION,
  })
  @Delete(`:${UserConstants.USER_ID_PARAM_NAME}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param(UserConstants.USER_ID_PARAM_NAME) id: string,
  ): Promise<void> {
    await this.userService.delete(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllWithPagination(
    @Query() query: QueryUserDto,
  ): Promise<PaginationResultType<User>> {
    const { page, limit } = query;

    const effectiveLimit = Math.min(limit || 10, 50);

    const result = await this.userService.findManyWithPagination({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: { page, limit: effectiveLimit },
    });

    return pagination(result, { page, limit: effectiveLimit });
  }
}
