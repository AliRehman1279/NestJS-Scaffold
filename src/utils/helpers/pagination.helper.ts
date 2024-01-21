import { IPaginationOptions, PaginationResultType } from '../types';

export const pagination = <T>(
  data: T[],
  options: IPaginationOptions,
): PaginationResultType<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
