import { boardKeys } from '@/lib/board/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { TBoard } from '@/types/db';
import { CacheHandlers } from '../cache-types';

export default function boardCacheController(queryClient: QueryClient): CacheHandlers<TBoard> {
  const queryKey = boardKeys._def;

  return {
    handleInsert: board => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: board,
      });
    },

    handleUpdate: board => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: board,
      });
    },

    handleDelete: id => {
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: id,
      });
    },
  };
}
