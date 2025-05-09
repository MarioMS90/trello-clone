import { TMember } from '@/types/db';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { membersKeys } from '@/lib/user/queries';
import { CacheHandlers } from '../cache-types';

export default function memberCacheController(queryClient: QueryClient): CacheHandlers<TMember> {
  const defQueryKey = membersKeys._def;

  return {
    handleInsert: member => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: member,
      });
    },

    handleUpdate: member => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: member,
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
