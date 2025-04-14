'use server';

import { TActionState } from '@/types/db';
import { CreateListSchema, UpdateListSchema } from '@/schemas/workspace-schemas';
import { TablesUpdate } from '@/types/database-types';
import { createClient } from '../supabase/server';
import { deleteEntity, updateEntity } from '../supabase/utils';

export async function createList({
  boardId,
  name,
  rank,
}: {
  boardId: string;
  name: string;
  rank: string;
}): Promise<TActionState> {
  const validatedFields = CreateListSchema.safeParse({
    boardId,
    name,
    rank,
  });
  if (!validatedFields.success) {
    throw new Error('Failed to create list.');
  }

  const supabase = await createClient();
  const { error } = await supabase
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

  return { success: true };
}

export async function updateList(listData: TablesUpdate<'lists'> & { id: string }) {
  const validatedFields = UpdateListSchema.safeParse(listData);

  if (!validatedFields.success) {
    throw new Error('Invalid list data');
  }

  return updateEntity({ tableName: 'lists', entityData: listData });
}

export async function deleteList(listId: string) {
  return deleteEntity({ tableName: 'lists', entityId: listId });
}
