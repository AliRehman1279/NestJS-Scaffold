import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  FilterUserDto,
  ProfessionDto,
  SortUserDto,
  UpdateUserDto,
} from './dto';
import { User, UserSchemaDocument } from './schema';
import { EntityCondition, IPaginationOptions } from 'src/utils/types';

@Injectable()
export class UserService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserSchemaDocument>,
  ) {
    this.logger = new Logger(UserService.name);
  }

  private _findDuplicateProfessionName(professions: ProfessionDto[]): boolean {
    const nameCount: Record<string, number> = {};

    for (const profession of professions) {
      const { name } = profession;

      nameCount[name] = (nameCount[name] || 0) + 1;

      if (nameCount[name] > 1) {
        return true;
      }
    }

    return false;
  }

  private async _findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  private async _findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto;
    sortOptions?: SortUserDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: EntityCondition<User> = filterOptions?.domain
      ? { domain: filterOptions.domain }
      : {};

    const userObjects = await this.userModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return userObjects;
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this._findByEmail(user.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hasDuplicateProffesionName = this._findDuplicateProfessionName(
        user.professions,
      );

      if (hasDuplicateProffesionName)
        throw new BadRequestException('Profession name must be unique');

      const toCreateUser = new this.userModel(user);
      const createdUser = await toCreateUser.save();
      return createdUser;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof ConflictException) {
        throw new ConflictException(error.message, 'Email Conflict');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message, 'Bad Request');
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
        'Internal Server Error',
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    try {
      const isValidId = await this.findById(id);
      if (!isValidId) throw new BadRequestException('Invalid User ID');

      const existingUser = await this._findByEmail(user.email);

      if (existingUser) throw new ConflictException('Email already exists');

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, user, { new: true })
        .exec();
      return updatedUser;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof ConflictException) {
        throw new ConflictException(error.message, 'Email Conflict');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message, 'Bad Request');
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
        'Internal Server Error',
      );
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      const isValidId = await this.findById(id);
      if (!isValidId) throw new BadRequestException('Invalid User ID');

      const user = await this.userModel.findByIdAndDelete(id).exec();
      return user;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message, 'Bad Request');
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
        'Internal Server Error',
      );
    }
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this._findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
