'use server';

import { TActionState, initialActionState } from '@/types/db';
import { CreateBoardSchema, UpdateBoardSchema } from '@/schemas/workspace-schemas';
import { TablesUpdate } from '@/types/database-types';
import { redirect } from 'next/navigation';
import { createClient } from '../supabase/server';
import { deleteEntity, getAuthUser, updateEntity } from '../supabase/utils';

export async function createBoard(
  workspaceIdParam: string | undefined,
  redirectToNewBoard: boolean,
  _: TActionState,
  formData: FormData,
): Promise<TActionState> {
  if (!formData) {
    return initialActionState;
  }

  const validatedFields = CreateBoardSchema.safeParse({
    name: formData.get('name'),
    workspaceId: workspaceIdParam ?? formData.get('workspace-id'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create board.',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('boards')
    .insert({ name: validatedFields.data.name, workspace_id: validatedFields.data.workspaceId })
    .select()
    .single();

  if (error) throw error;

  if (redirectToNewBoard) {
    redirect(`/boards/${data.id}`);
  }

  return { success: true };
}

export async function updateBoard(boardData: TablesUpdate<'boards'> & { id: string }) {
  const validatedFields = UpdateBoardSchema.safeParse(boardData);
  if (!validatedFields.success) {
    throw new Error('Invalid board data');
  }

  return updateEntity({ tableName: 'boards', entityData: boardData });
}

export async function deleteBoard(boardId: string, redirectUrl?: string) {
  return deleteEntity({ tableName: 'boards', entityId: boardId, redirectUrl });
}

export async function createStarredBoard(boardId: string) {
  const supabase = await createClient();
  const user = await getAuthUser();

  const { data, error } = await supabase
    .from('starred_boards')
    .insert({ user_id: user.id, board_id: boardId })
    .select('id')
    .single();

  if (error) throw error;

  return data;
}

export async function deleteStarredBoard(boardId: string) {
  const supabase = await createClient();
  const user = await getAuthUser();

  const { error } = await supabase
    .from('starred_boards')
    .delete()
    .eq('user_id', user.id)
    .eq('board_id', boardId);

  if (error) throw error;
}
