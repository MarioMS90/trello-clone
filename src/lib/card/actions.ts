'use server';

import { TCard } from '@/types/db';
import { CreateCardSchema } from '@/schemas/workspace-schemas';
import { createClient } from '../supabase/server';

export async function createCard({
  listId,
  name,
  rank,
}: {
  listId: string;
  name: string;
  rank: string;
}): Promise<TCard> {
  const validatedFields = CreateCardSchema.safeParse({
    listId,
    name,
    rank,
  });
  if (!validatedFields.success) {
    throw new Error('Missing fields. Failed to create list.');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cards')
    .insert({
      name: validatedFields.data.name,
      description: '',
      rank: validatedFields.data.rank,
      list_id: validatedFields.data.listId,
    })
    .select(
      ` 
      *,
      comments(
        *
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}
