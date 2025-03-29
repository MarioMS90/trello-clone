'use server';

import { TActionState, initialActionState } from '@/types/db';
import { CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { getAuthUser, getClient } from '../supabase/utils';

export async function createWorkspace(_: TActionState, formData: FormData): Promise<TActionState> {
  if (!formData) {
    return initialActionState;
  }

  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create workspace.',
    };
  }

  const supabase = await getClient();
  const user = await getAuthUser();

  const newId = crypto.randomUUID();
  const { error: workspaceError } = await supabase
    .from('workspaces')
    .insert({ id: newId, name: validatedFields.data.name });

  if (workspaceError) throw workspaceError;

  const { error: userWorkspaceError } = await supabase
    .from('user_workspaces')
    .insert({ user_id: user.id, workspace_id: newId })
    .select();

  if (userWorkspaceError) {
    await supabase.from('workspaces').delete().eq('id', newId);
    throw userWorkspaceError;
  }

  return { success: true };
}

export async function globalSearchAction(term: string) {
  const supabase = await getClient();

  return supabase.rpc('search_workspaces_boards_cards', { search_term: term });
}
