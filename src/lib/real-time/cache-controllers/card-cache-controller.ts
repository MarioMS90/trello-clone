import { TCard } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function cardCacheController(queryClient: QueryClient): CacheHandlers<TCard> {
  const queryKey = cardKeys._def;

  return {
    handleInsert: card => {
      insertQueryData({
        queryClient,
        queryKey,
        entity: { ...card, commentCount: 0 },
      });
    },

    handleUpdate: card => {
      updateQueryData({
        queryClient,
        queryKey,
        entity: card,
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
