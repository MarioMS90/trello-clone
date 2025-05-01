import { TStarredBoard } from '@/types/db';
import { starredBoardKeys } from '@/lib/board/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

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

    handleDelete: id => {
      deleteQueryData({
        queryClient,
        defQueryKey,
        entityId: id,
      });
    },
  };
}
