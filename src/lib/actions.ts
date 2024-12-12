'use server';

import { revalidatePath } from 'next/cache';
import { ActionState, initialState } from '@/types/app-types';
import { CreateBoardSchema, CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { SearchResults } from '@/types/search-types';
import { createClient } from './supabase/server';

export async function createWorkspaceAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!formData) {
    return initialState;
  }

  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Workspace.',
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error: workspaceError } = await supabase
    .from('workspace')
    .insert({ name: validatedFields.data.name })
    .select('id')
    .single();

  if (workspaceError) throw new Error(workspaceError.message);

  const { error: userWorkspaceError } = await supabase
    .from('user_workspace')
    .insert({ user_id: user.id, workspace_id: data.id })
    .select();

  if (userWorkspaceError) {
    await supabase.from('workspace').delete().eq('id', data.id);
    throw new Error(userWorkspaceError.message);
  }

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function createBoardAction(
  workspaceIdParam: string | undefined,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!formData) {
    return initialState;
  }

  const validatedFields = CreateBoardSchema.safeParse({
    workspaceId: workspaceIdParam ?? formData.get('workspace-id'),
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Board.',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('board')
    .insert({ name: validatedFields.data.name, workspace_id: validatedFields.data.workspaceId });

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function renameWorkspaceAction(
  workspaceId: string,
  newName: string,
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('workspace')
    .update({ name: newName })
    .eq('id', workspaceId);

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function deleteWorkspaceAction(workspaceId: string): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from('workspace').delete().eq('id', workspaceId);

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function renameBoardAction(boardId: string, newName: string): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from('board').update({ name: newName }).eq('id', boardId);

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function deleteBoardAction(boardId: string): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from('board').delete().eq('id', boardId);

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function starToggleAction(boardId: string, starred: boolean): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from('board').update({ starred }).eq('id', boardId);

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function globalSearchAction(term: string): Promise<SearchResults> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('search_workspaces_boards_tasks', {
    search_term: term,
  });

  if (error) throw new Error(error.message);

  return data;
}
