import { TList } from '@/types/db';
import { listKeys } from '@/lib/list/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function listCacheController(queryClient: QueryClient): CacheHandlers<TList> {
  const defQueryKey = listKeys._def;

  return {
    handleInsert: list => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: list,
      });
    },

    handleUpdate: list => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: list,
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
