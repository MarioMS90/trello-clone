import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClient } from '../supabase/utils';

async function fetchComments(cardId: string) {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('comments')
    .select(
      ` 
      id,
      content,
      userId: user_id,
      cardId: card_id,
      workspaceId: workspace_id,
      createdAt: created_at
    `,
    )
    .eq('card_id', cardId);

  if (error) throw error;

  return data;
}

export const commentKeys = createQueryKeys('comments', {
  list: (cardId: string) => ({
    queryKey: ['comments', cardId],
    queryFn: async () => fetchComments(cardId),
  }),
});

export function useComments(cardId: string) {
  return useSuspenseQuery(commentKeys.list(cardId));
}
