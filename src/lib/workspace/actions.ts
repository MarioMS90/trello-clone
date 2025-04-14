'use server';

import { TActionState, initialActionState } from '@/types/db';
import { CreateWorkspaceSchema, UpdateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { TablesUpdate } from '@/types/database-types';
import { deleteEntity, getClient, updateEntity } from '../supabase/utils';

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

export async function updateWorkspace(workspaceData: TablesUpdate<'workspaces'> & { id: string }) {
  const validatedFields = UpdateWorkspaceSchema.safeParse(workspaceData);
  if (!validatedFields.success) {
    throw new Error('Invalid workspace data');
  }

  return updateEntity({ tableName: 'workspaces', entityData: workspaceData });
}

export async function deleteWorkspace(workspaceId: string) {
  return deleteEntity({ tableName: 'workspaces', entityId: workspaceId });
}
