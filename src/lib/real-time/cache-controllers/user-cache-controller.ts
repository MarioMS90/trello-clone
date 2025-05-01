import { TUser } from '@/types/db';
import { userKeys } from '@/lib/user/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function userCacheController(queryClient: QueryClient): CacheHandlers<TUser> {
  const queryKey = userKeys._def;

  return {
    handleInsert: user => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: user,
      });
    },

    handleUpdate: user => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: user,
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
