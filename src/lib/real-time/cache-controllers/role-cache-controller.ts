import { TRole } from '@/types/db';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { rolesKeys } from '@/lib/user/queries';
import { CacheHandlers } from '../cache-types';

export default function roleCacheController(queryClient: QueryClient): CacheHandlers<TRole> {
  const defQueryKey = rolesKeys._def;

  return {
    handleInsert: role => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: role,
      });
    },

    handleUpdate: role => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: role,
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
