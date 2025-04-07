'use server';

import { TActionState, initialActionState, TBoard } from '@/types/db';
import { CreateBoardSchema, UpdateBoardSchema } from '@/schemas/workspace-schemas';
import { TablesUpdate } from '@/types/database-types';
import { redirect } from 'next/navigation';
import { createClient } from '../supabase/server';
import { getAuthUser } from '../supabase/utils';
import { testAction } from '../workspace/actions';

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

export async function updateBoard(
  boardData: TablesUpdate<'boards'> & { id: string },
): Promise<TActionState<TBoard>> {
  const supabase = await createClient();

  const validatedFields = UpdateBoardSchema.safeParse(boardData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update board.',
    };
  }

  const { data, error } = await supabase
    .from('boards')
    .update(validatedFields.data)
    .eq('id', boardData.id)
    .select(
      `
      id,
      name,
      workspaceId: workspace_id,
      workspaces!inner(
        user_workspaces!inner()
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return {
    data,
  };
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

  testAction();

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

  testAction();

  if (error) throw error;
}
