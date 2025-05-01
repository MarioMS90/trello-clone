import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClient } from '../supabase/get-client';

const fetchComments = async (cardId: string) => {
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
};

export const commentKeys = createQueryKeys('comments', {
  list: (cardId: string) => ({
    queryKey: ['comments', cardId],
    queryFn: async () => fetchComments(cardId),
  }),
});

export const useComments = (cardId: string) => useSuspenseQuery(commentKeys.list(cardId));
