export type PaginationResultType<T> = Readonly<{
  data: T[];
  hasNextPage: boolean;
}>;
