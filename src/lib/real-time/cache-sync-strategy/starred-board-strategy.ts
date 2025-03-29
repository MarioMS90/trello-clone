import { QueryClient } from '@tanstack/react-query';
import { TStarredBoard } from '@/types/db';
import Strategy from './strategy';

export default class StarredBoardStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(starredBoard: TStarredBoard) {}

  handleUpdate(starredBoard: TStarredBoard) {}

  handleDelete(starredBoardId: string) {}
}
