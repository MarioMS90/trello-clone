import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClient } from '../supabase/utils';

const fetchComments = async (cardId: string) => {
  const supabase = await getClient();

  const { data } = await supabase
    .from('comments')
    .select(
      ` 
      id,
      content,
      userId: user_id,
      cardId: card_id,
      workspaceId: workspace_id,
      createdAt: created_at,
      updatedAt: updated_at
    `,
    )
    .eq('card_id', cardId)
    .throwOnError();

  return data;
};

export const commentKeys = createQueryKeys('comments', {
  list: (cardId: string) => ({
    queryKey: [cardId],
    queryFn: () => fetchComments(cardId),
  }),
});

export const useComments = (cardId: string) => useSuspenseQuery(commentKeys.list(cardId));
