import { TCard, TComment } from '@/types/db';
import { cardKeys } from '@/lib/card/queries';
import { camelizeKeys } from '@/lib/utils/utils';
import {
  insertQueryData,
  updateQueryData,
  deleteQueryData,
} from '@/lib/utils/react-query/query-data-utils';
import { QueryClient } from '@tanstack/react-query';
import { CacheController } from '@/types/cache-types';
import { commentKeys } from '@/lib/comment/queries';

export default function cardCacheController(queryClient: QueryClient): CacheController {
  return {
    handleInsert: payload => {
      const entity = camelizeKeys(payload.new) as TCard;

      // Supabase realtime doesn't provide calculated fields that doesn't belong to the entity,
      // so we need to get the comments count from the query cache.
      const comments = queryClient.getQueryData<TComment[]>(commentKeys.list(entity.id).queryKey);
      const commentCount = comments?.length ?? 0;

      insertQueryData({
        queryClient,
        queryKey: cardKeys.list(entity.listId).queryKey,
        entity: { ...entity, commentCount },
      });
    },

    handleUpdate: payload => {
      const entity = camelizeKeys(payload.new) as TCard;

      updateQueryData({
        queryClient,
        queryKey: cardKeys.list(entity.listId).queryKey,
        entity,
      });
    },

    handleDelete: payload => {
      const entity = camelizeKeys(payload.old) as TCard;

      deleteQueryData({
        queryClient,
        queryKey: cardKeys.list(entity.listId).queryKey,
        entityId: entity.id,
      });
    },
  };
}
