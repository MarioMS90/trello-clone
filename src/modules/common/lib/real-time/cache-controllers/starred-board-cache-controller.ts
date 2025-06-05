import { TStarredBoard } from '@/modules/common/types/db';
import { starredBoardKeys } from '@/modules/board/lib/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';

export default function starredBoardCacheController(
  queryClient: QueryClient,
): CacheHandlers<TStarredBoard> {
  const queryKey = starredBoardKeys._def;

  return {
    handleInsert: starredBoard => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: starredBoard,
      });
    },

    handleUpdate: starredBoard => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: starredBoard,
      });
    },

    handleDelete: starredBoard => {
      const data = queryClient.getQueriesData<TStarredBoard[]>({
        queryKey: queryKey,
      });
      const match = data
        .flatMap(([_, starredBoards = []]) => starredBoards)
        .find(_starredBoard => _starredBoard.boardId === starredBoard.boardId);

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: match?.id,
      });
    },
  };
}
