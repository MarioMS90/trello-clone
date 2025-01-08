'use server';

import { ActionState, Board, initialState, SubsetWithId, Workspace } from '@/types/app-types';
import { CreateBoardSchema, CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { SearchResults } from '@/types/search-types';
import { createClient, execQuery } from './supabase/server';
import { revalidateDashboard } from './server-utils';

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

  revalidateDashboard();
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

  await execQuery(async supabase =>
    supabase
      .from('board')
      .insert({ name: validatedFields.data.name, workspace_id: validatedFields.data.workspaceId }),
  );

  revalidateDashboard();

  return { success: true };
}

export async function globalSearchAction(term: string): Promise<SearchResults> {
  return execQuery<SearchResults>(async supabase =>
    supabase.rpc('search_workspaces_boards_cards', { search_term: term }),
  );
}

export const updateWorkspaceAction = async (workspace: SubsetWithId<Workspace>) => {
  await execQuery(async supabase =>
    supabase.from('workspace').update(workspace).eq('id', workspace.id),
  );
  revalidateDashboard();
};

export const deleteWorkspaceAction = async (workspaceId: string) => {
  await execQuery(async supabase => supabase.from('workspace').delete().eq('id', workspaceId));
  revalidateDashboard();
};

export const updateBoardAction = async (board: SubsetWithId<Board>) => {
  await execQuery(async supabase => supabase.from('board').update(board).eq('id', board.id));
  revalidateDashboard();
};

export async function deleteBoardAction(boardId: string) {
  await execQuery(async supabase => supabase.from('board').delete().eq('id', boardId));
  revalidateDashboard();
}
