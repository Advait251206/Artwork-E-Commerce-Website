import { Query } from 'mongoose';

interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function applyQueryParams<T>(
  query: Query<T[], T>,
  params: QueryParams,
): { query: Query<T[], T>; page: number; limit: number } {
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || '20', 10)));
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (params.sort) {
    const sortObj: Record<string, 1 | -1> = {};
    params.sort.split(',').forEach((field) => {
      if (field.startsWith('-')) {
        sortObj[field.slice(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });
    query = query.sort(sortObj);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  return { query, page, limit };
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}
