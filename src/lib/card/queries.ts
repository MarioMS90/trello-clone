import { getClient } from '../supabase/utils';

async function fetchCards(boardId: string) {
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
      list!inner(),
      comment(
        count
      )
    `,
    )
    .eq('list.board_id', boardId)
    .order('rank');

  if (error) throw error;

  return data?.map(card => ({ ...card, commentCount: card.comment[0].count, comment: undefined }));
}
