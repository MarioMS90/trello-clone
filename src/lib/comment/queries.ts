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
      createdAt: created_at
    `,
    )
    .eq('card_id', cardId);

  if (error) throw error;

  return data;
}
