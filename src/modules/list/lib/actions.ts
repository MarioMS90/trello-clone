'use server';

import { CreateListSchema, UpdateListSchema } from '@/modules/common/schemas/workspace-schemas';
import { TablesUpdate } from '@/modules/common/types/database-types';
import { deleteEntity, insertEntity, updateEntity } from '@/modules/supabase/server-utils';

export async function createList({
  boardId,
  name,
  rank,
}: {
  boardId: string;
  name: string;
  rank: string;
}) {
  const validatedFields = CreateListSchema.safeParse({
    boardId,
    name,
    rank,
  });
  if (!validatedFields.success) {
    throw new Error('Missing fields. Failed to create list.');
  }

  const list = await insertEntity({
    tableName: 'lists',
    entityData: {
      name: validatedFields.data.name,
      rank: validatedFields.data.rank,
      board_id: validatedFields.data.boardId,
    },
  });

  return { data: list };
}

export async function updateList(listData: TablesUpdate<'lists'> & { id: string }) {
  const validatedFields = UpdateListSchema.safeParse(listData);

  if (!validatedFields.success) {
    throw new Error('Invalid list data');
  }

  const list = await updateEntity({ tableName: 'lists', entityData: listData });

  return { data: list };
}

export async function deleteList(listId: string) {
  const id = await deleteEntity({ tableName: 'lists', entityId: listId });

  return { data: { id } };
}
