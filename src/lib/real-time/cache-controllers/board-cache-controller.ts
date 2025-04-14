import { TBoard } from '@/types/db';
import { boardKeys } from '@/lib/board/queries';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';

export default function boardCacheController(queryClient: QueryClient): CacheController {
  const { queryKey } = boardKeys.list();

  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TBoard;

      insertQueryData({
        queryClient,
        queryKey,
        entity,
      });
    },

    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TBoard;

      updateQueryData({
        queryClient,
        queryKey,
        entity,
      });
    },

    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TBoard;

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: entity.id,
      });
    },
  };
}
