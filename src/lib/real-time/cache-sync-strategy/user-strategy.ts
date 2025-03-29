import { QueryClient } from '@tanstack/react-query';
import { TUser } from '@/types/db';
import Strategy from './strategy';

export default class UserStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(user: TUser) {}

  handleUpdate(user: TUser) {}

  handleDelete(userId: string) {}
}
