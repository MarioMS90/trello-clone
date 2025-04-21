import { TCard } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheHandlers } from '../cache-types';

export default function cardCacheController(queryClient: QueryClient): CacheHandlers<TCard> {
  return {
    handleInsert: card => {
      insertQueryData({
        queryClient,
        queryKey: cardKeys.list(card.listId).queryKey,
        entity: { ...card, commentCount: 0 },
      });
    },

    handleUpdate: card => {
      updateQueryData({
        queryClient,
        queryKey: cardKeys.list(card.listId).queryKey,
        entity: card,
      });
    },

    handleDelete: card => {
      deleteQueryData({
        queryClient,
        queryKey: cardKeys.list(card.listId).queryKey,
        entityId: card.id,
      });
    },
  };
}
