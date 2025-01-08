'use server';

import { revalidatePath } from 'next/cache';
import { ActionState, Board, initialState, SubsetWithId, Workspace } from '@/types/app-types';
import { CreateBoardSchema, CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { SearchResults } from '@/types/search-types';
import { createClient, deleteEntity, execQuery, updateEntity } from './supabase/server';

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

  const newId = crypto.randomUUID();
  const { error: workspaceError } = await supabase
    .from('workspace')
    .insert({ id: newId, name: validatedFields.data.name });

  if (workspaceError) throw new Error(workspaceError.message);

  const { error: userWorkspaceError } = await supabase
    .from('user_workspace')
    .insert({ user_id: user.id, workspace_id: newId })
    .select();

  if (userWorkspaceError) {
    await supabase.from('workspace').delete().eq('id', newId);
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

export async function globalSearchAction(term: string): Promise<SearchResults> {
  const data = await execQuery<SearchResults>(async supabase =>
    supabase.rpc('search_workspaces_boards_cards', { search_term: term }),
  );

  return data;
}

export const updateWorkspaceAction = async (workspace: SubsetWithId<Workspace>) =>
  updateEntity(workspace, 'workspace', { revalidateParams: ['/dashboard', 'layout'] });

export const deleteWorkspaceAction = async (workspaceId: string) =>
  deleteEntity(workspaceId, 'workspace', { revalidateParams: ['/dashboard', 'layout'] });

export const updateBoardAction = async (board: SubsetWithId<Board>) =>
  updateEntity(board, 'board', { revalidateParams: ['/dashboard', 'layout'] });

export const deleteBoardAction = async (boardId: string) =>
  deleteEntity(boardId, 'board', { revalidateParams: ['/dashboard', 'layout'] });
