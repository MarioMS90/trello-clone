import { QueryClient } from '@tanstack/react-query';
import { TBoard, TEntity, TEntityName } from '@/types/db';
import { boardKeys } from '@/lib/board/queries';
import CacheSyncStrategy from './cache-sync-strategy';

export default class BoardStrategy implements CacheSyncStrategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(newEntity: TEntity<TEntityName>) {
    const newBoard = newEntity as TBoard;

    this.queryClient.setQueryData(boardKeys.list().queryKey, (oldBoards: TBoard[]) => {
      if (!oldBoards) {
        return undefined;
      }

      return [...oldBoards, newBoard];
    });
  }

  handleUpdate(updatedEntity: TEntity<TEntityName>) {
    const updatedBoard = updatedEntity as TBoard;

    this.queryClient.setQueryData(boardKeys.list().queryKey, (oldBoards: TBoard[]) => {
      if (!oldBoards) {
        return undefined;
      }

      return oldBoards.map(board => (board.id === updatedBoard.id ? updatedBoard : board));
    });
  }

  handleDelete(boardId: string) {
    this.queryClient.setQueryData(boardKeys.list().queryKey, (oldBoards: TBoard[]) => {
      if (!oldBoards) {
        return undefined;
      }

      return oldBoards.filter(board => board.id !== boardId);
    });
  }
}
