'use server';

import { ActionState, initialState } from '@/types/app-types';
import { CreateBoardSchema, CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { PublicSchema, TablesUpdate } from '@/types/database-types';
import { createClient } from './supabase/server';
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

  if (!user) {
    throw new Error('User not logged in');
  }

  const newId = crypto.randomUUID();
  const { error: workspaceError } = await supabase
    .from('workspace')
    .insert({ id: newId, name: validatedFields.data.name });

  if (workspaceError) {
    throw workspaceError;
  }

  const { error: userWorkspaceError } = await supabase
    .from('user_workspace')
    .insert({ user_id: user.id, workspace_id: newId })
    .select();

  if (userWorkspaceError) {
    await supabase.from('workspace').delete().eq('id', newId);
    throw userWorkspaceError;
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

  const supabase = await createClient();
  const { error } = await supabase
    .from('board')
    .insert({ name: validatedFields.data.name, workspace_id: validatedFields.data.workspaceId });

  if (error) {
    throw error;
  }

  revalidateDashboard();

  return { success: true };
}

export async function globalSearchAction(term: string) {
  const supabase = await createClient();

  return supabase.rpc('search_workspaces_boards_cards', { search_term: term });
}

export async function updateEntityAction<TableName extends keyof PublicSchema['Tables']>(
  relation: TableName,
  entityData: TablesUpdate<TableName> & { id: string },
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(relation as keyof PublicSchema['Tables'])
    .update(entityData)
    .eq('id', entityData.id);

  if (error) {
    throw error;
  }

  revalidateDashboard();
}

export async function deleteEntityAction<TableName extends keyof PublicSchema['Tables']>(
  relation: TableName,
  entityId: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from(relation).delete().eq('id', entityId);

  if (error) {
    throw error;
  }

  revalidateDashboard();
}
