'use server';

import { TMutationInsert, TMutationUpdate, TMutationDelete } from '@/types/db';
import { CreateWorkspaceSchema, UpdateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { TablesInsert, TablesUpdate } from '@/types/database-types';
import { deleteEntity, getClient, updateEntity } from '../supabase/utils';

export async function createWorkspace(
  workspaceData: TablesInsert<'workspaces'>,
): Promise<TMutationInsert> {
  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: workspaceData.name,
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create workspace.',
    };
  }

  const supabase = await getClient();

  const { data: workspaceId, error } = await supabase.rpc('create_workspace_with_admin_access', {
    workspace_name: validatedFields.data.name,
  });

  if (error) {
    throw error;
  }

  return { data: { id: workspaceId } };
}

export async function updateWorkspace(
  workspaceData: TablesUpdate<'workspaces'> & { id: string },
): Promise<TMutationUpdate> {
  const validatedFields = UpdateWorkspaceSchema.safeParse(workspaceData);
  if (!validatedFields.success) {
    throw new Error('Invalid workspace data');
  }

  const updatedAt = await updateEntity({ tableName: 'workspaces', entityData: workspaceData });

  return { data: { id: workspaceData.id, updatedAt } };
}

export async function deleteWorkspace(workspaceId: string): Promise<TMutationDelete> {
  await deleteEntity({ tableName: 'workspaces', entityId: workspaceId });

  return { data: { id: workspaceId } };
}
