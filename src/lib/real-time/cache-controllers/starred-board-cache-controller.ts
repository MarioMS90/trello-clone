import { TStarredBoard } from '@/types/db';
import { starredBoardKeys } from '@/lib/board/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function starredBoardCacheController(
  queryClient: QueryClient,
): CacheHandlers<TStarredBoard> {
  const { queryKey } = starredBoardKeys.list();

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
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: starredBoard.id,
      });
    },
  };
}
