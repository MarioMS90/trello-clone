'use server';

import { TList } from '@/types/db';
import { CreateListSchema } from '@/schemas/workspace-schemas';
import { createClient } from '../supabase/server';

export async function createList({
  boardId,
  name,
  rank,
}: {
  boardId: string;
  name: string;
  rank: string;
}): Promise<TList> {
  const validatedFields = CreateListSchema.safeParse({
    boardId,
    name,
    rank,
  });
  if (!validatedFields.success) {
    throw new Error('Failed to create list.');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lists')
    .insert({
      name: validatedFields.data.name,
      rank: validatedFields.data.rank,
      board_id: validatedFields.data.boardId,
    })
    .select(
      ` 
      *,
      cards: card(
        *,
        comments: comment(
          *
        )
      )
    `,
    )
    .single();

  if (error) throw error;

  return data;
}
