import { TCard } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function cardCacheController(queryClient: QueryClient): CacheHandlers<TCard> {
  const defQueryKey = cardKeys._def;

  return {
    handleInsert: card => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: { ...card, commentCount: 0 },
      });
    },

    handleUpdate: card => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: card,
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
