import { QueryClient } from '@tanstack/react-query';
import { TBoard } from '@/types/db';
import Strategy from './strategy';

export default class BoardStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(board: TBoard) {}

  handleUpdate(board: TBoard) {}

  handleDelete(boardId: string) {}
}
