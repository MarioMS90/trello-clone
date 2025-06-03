'use server';

import { CreateCardSchema, UpdateCardSchema } from '@/modules/common/schemas/workspace-schemas';
import { TablesUpdate } from '@/modules/common/types/database-types';
import { deleteEntity, insertEntity, updateEntity } from '@/modules/supabase/server-utils';

export async function createCard({
  listId,
  name,
  rank,
}: {
  listId: string;
  name: string;
  rank: string;
}) {
  const validatedFields = CreateCardSchema.safeParse({
    listId,
    name,
    rank,
  });
  if (!validatedFields.success) {
    throw new Error('Missing fields. Failed to create card.');
  }

  const card = await insertEntity({
    tableName: 'cards',
    entityData: {
      name: validatedFields.data.name,
      rank: validatedFields.data.rank,
      list_id: validatedFields.data.listId,
      description: '',
    },
  });

  return { data: card };
}

export async function updateCard(cardData: TablesUpdate<'cards'> & { id: string }) {
  const validatedFields = UpdateCardSchema.safeParse(cardData);

  if (!validatedFields.success) {
    throw new Error('Invalid card data');
  }

  const card = await updateEntity({ tableName: 'cards', entityData: cardData });

  return { data: card };
}

export async function deleteCard(cardId: string) {
  const id = await deleteEntity({ tableName: 'cards', entityId: cardId });

  return { data: { id } };
}
