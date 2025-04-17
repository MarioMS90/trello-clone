import { TCard, TComment } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/lib/comment/queries';
import { CacheHandlers } from '../cache-types';

export default function cardCacheController(queryClient: QueryClient): CacheHandlers<TCard> {
  return {
    handleInsert: card => {
      // Supabase realtime doesn't provide calculated fields that don't belong to the entity,
      // so we need to get the comments count from the query cache.
      const comments = queryClient.getQueryData<TComment[]>(commentKeys.list(card.id).queryKey);
      const commentCount = comments?.length ?? 0;

      insertQueryData({
        queryClient,
        queryKey: cardKeys.list(card.listId).queryKey,
        entity: { ...card, commentCount },
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
