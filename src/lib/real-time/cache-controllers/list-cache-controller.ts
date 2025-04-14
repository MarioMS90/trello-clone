import { TList } from '@/types/db';
import { listKeys } from '@/lib/list/queries';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';

export default function listCacheController(queryClient: QueryClient): CacheController {
  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TList;

      insertQueryData({
        queryClient,
        queryKey: listKeys.list(entity.boardId).queryKey,
        entity,
      });
    },

    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TList;

      updateQueryData({
        queryClient,
        queryKey: listKeys.list(entity.boardId).queryKey,
        entity,
      });
    },

    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TList;

      deleteQueryData({
        queryClient,
        queryKey: listKeys.list(entity.boardId).queryKey,
        entityId: entity.id,
      });
    },
  };
}
