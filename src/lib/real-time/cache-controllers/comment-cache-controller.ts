import { TCard, TComment } from '@/types/db';
import { commentKeys } from '@/lib/comment/queries';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';
import { cardKeys } from '@/lib/card/queries';

export default function commentCacheController(queryClient: QueryClient): CacheController {
  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TComment;

      insertQueryData({
        queryClient,
        queryKey: commentKeys.list(entity.cardId).queryKey,
        entity,
      });

      // Update the card with the new comment
      const queryData = queryClient.getQueriesData<TCard[]>({
        queryKey: ['cards'],
        type: 'active',
      });
      const card = queryData
        .flatMap(([_, cards]) => cards ?? [])
        .find(_card => _card.id === entity.cardId);

      if (!card) {
        return;
      }

      updateQueryData({
        queryClient,
        queryKey: cardKeys.list(card.listId).queryKey,
        entity: card,
      });
    },

    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TComment;

      updateQueryData({
        queryClient,
        queryKey: commentKeys.list(entity.cardId).queryKey,
        entity,
      });
    },

    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TComment;

      deleteQueryData({
        queryClient,
        queryKey: commentKeys.list(entity.cardId).queryKey,
        entityId: entity.id,
      });
    },
  };
}
