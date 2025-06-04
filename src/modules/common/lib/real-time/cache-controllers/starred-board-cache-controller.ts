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
  const defQueryKey = starredBoardKeys._def;

  return {
    handleInsert: starredBoard => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: starredBoard,
      });
    },

    handleUpdate: starredBoard => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: starredBoard,
      });
    },

    handleDelete: starredBoard => {
      const data = queryClient.getQueriesData<TStarredBoard[]>({
        queryKey: defQueryKey,
      });
      const match = data
        .flatMap(([_, starredBoards = []]) => starredBoards)
        .find(_starredBoard => _starredBoard.boardId === starredBoard.boardId);

      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: match?.id,
      });
    },
  };
}
