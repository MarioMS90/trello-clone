import { boardKeys } from '@/modules/board/lib/queries';
import { QueryClient } from '@tanstack/react-query';
import { TBoard } from '@/modules/common/types/db';
import { CacheHandlers } from '@/modules/common/lib/real-time/types';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/modules/common/lib/react-query/utils';

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

    handleDelete: board => {
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: board.id,
      });
    },
  };
}
