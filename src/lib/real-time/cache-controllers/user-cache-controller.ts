import { TUser } from '@/types/db';
import { userKeys } from '@/lib/user/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function userCacheController(queryClient: QueryClient): CacheHandlers<TUser> {
  const defQueryKey = userKeys._def;

  return {
    handleInsert: user => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: user,
      });
    },

    handleUpdate: user => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: user,
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
