import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClient } from '../supabase/utils';

async function fetchCards(listId: string) {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('cards')
    .select(
      `
      id,
      name,
      description,
      rank,
      listId: list_id,
      workspaceId: workspace_id,
      comment(
        count
      )
    `,
    )
    .eq('list_id', listId)
    .order('rank');

  if (error) throw error;

  return data?.map(card => ({ ...card, commentCount: card.comment[0].count, comment: undefined }));
}

export const cardKeys = createQueryKeys('cards', {
  list: (listId: string) => ({
    queryKey: ['cards', listId],
    queryFn: async () => fetchCards(listId),
  }),
});

export function useCards(listId: string) {
  return useSuspenseQuery(cardKeys.list(listId));
}
