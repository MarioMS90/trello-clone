import { TCard, TComment } from '@/types/db';
import { commentKeys } from '@/lib/comment/queries';
import { insertQueryData, updateQueryData, deleteQueryData } from '@/lib/react-query/utils';
import { QueryClient } from '@tanstack/react-query';
import { cardKeys } from '@/lib/card/queries';
import { CacheHandlers } from '../cache-types';

export default function commentCacheController(queryClient: QueryClient): CacheHandlers<TComment> {
  const defQueryKey = commentKeys._def;

  return {
    handleInsert: comment => {
      insertQueryData({
        queryClient,
        defQueryKey,
        entity: comment,
      });

      // Supabase realtime doesn't provide calculated fields that
      // don't belong to the entity, so we need to update the
      // card's comment count manually.
      const queriesData = queryClient.getQueriesData<TCard[]>({
        queryKey: ['cards'],
      });
      const card = queriesData
        .flatMap(([_, cards = []]) => cards)
        .find(_card => _card.id === comment.cardId);

      if (!card) {
        return;
      }

      updateQueryData({
        queryClient,
        defQueryKey: cardKeys._def,
        entity: card,
      });
    },

    handleUpdate: comment => {
      updateQueryData({
        queryClient,
        defQueryKey,
        entity: comment,
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
