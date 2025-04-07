'use server';

import { TActionState, initialActionState } from '@/types/db';
import { CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { getClient } from '../supabase/utils';

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

  const { error } = await supabase.rpc('create_workspace_with_admin_access', {
    workspace_name: validatedFields.data.name,
  });

  if (error) throw error;

  return { success: true };
}

export async function testAction(): Promise<TActionState> {
  const supabase = await getClient();

  const { error } = await supabase.rpc('create_workspace_with_admin_access', {
    workspace_name: 'test_workspace',
  });

  if (error) throw error;

  return { success: true };
}

export async function globalSearchAction(term: string) {
  const supabase = await getClient();

  return supabase.rpc('search_workspaces_boards_cards', { search_term: term });
}
