import { QueryClient } from '@tanstack/react-query';
import { TStarredBoard, TEntity, TEntityName } from '@/types/db';
import { starredBoardKeys } from '@/lib/board/queries';
import CacheSyncStrategy from './cache-sync-strategy';

export default class StarredBoardStrategy implements CacheSyncStrategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(newEntity: TEntity<TEntityName>) {
    const newStarredBoard = newEntity as TStarredBoard;

    this.queryClient.setQueryData(
      starredBoardKeys.list().queryKey,
      (oldStarredBoards: TStarredBoard[]) => {
        if (!oldStarredBoards) {
          return undefined;
        }

        return [...oldStarredBoards, newStarredBoard];
      },
    );
  }

  handleUpdate(updatedEntity: TEntity<TEntityName>) {
    const updatedStarredBoard = updatedEntity as TStarredBoard;

    this.queryClient.setQueryData(
      starredBoardKeys.list().queryKey,
      (oldStarredBoards: TStarredBoard[]) => {
        if (!oldStarredBoards) {
          return undefined;
        }
        return oldStarredBoards.map(starredBoard =>
          starredBoard.id === updatedStarredBoard.id ? updatedStarredBoard : starredBoard,
        );
      },
    );
  }

  handleDelete(starredBoardId: string) {
    this.queryClient.setQueryData(
      starredBoardKeys.list().queryKey,
      (oldStarredBoards: TStarredBoard[]) => {
        if (!oldStarredBoards) {
          return undefined;
        }

        return oldStarredBoards.filter(starredBoard => starredBoard.id !== starredBoardId);
      },
    );
  }
}
