import { boardKeys } from '@/modules/board/lib/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/modules/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { TBoard } from '@/modules/common/types/db';
import { CacheHandlers } from '@/modules/real-time/types';

export default function boardCacheController(queryClient: QueryClient): CacheHandlers<TBoard> {
  const defQueryKey = boardKeys._def;

  return {
    handleInsert: board => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: board,
      });
    },

    handleUpdate: board => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: board,
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
