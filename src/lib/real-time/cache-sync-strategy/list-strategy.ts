import { QueryClient } from '@tanstack/react-query';
import { TList } from '@/types/db';
import Strategy from './strategy';

export default class ListStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(list: TList) {}

  handleUpdate(list: TList) {}

  handleDelete(listId: string) {}
}
