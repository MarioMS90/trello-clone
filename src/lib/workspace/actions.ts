'use server';

import {
  TMutation,
  TMutationDelete,
  TMutationWorkspaceInsert,
  TUserWorkspace,
  TWorkspace,
} from '@/types/db';
import { CreateWorkspaceSchema, UpdateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { TablesInsert, TablesUpdate } from '@/types/database-types';
import { getClient } from '../supabase/get-client';
import { deleteEntity, updateEntity } from '../supabase/server-utils';

export async function createWorkspace(
  workspaceData: TablesInsert<'workspaces'>,
): Promise<TMutationWorkspaceInsert> {
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

  const { data, error } = await supabase.rpc('create_workspace_with_admin_access', {
    workspace_name: validatedFields.data.name,
  });

  if (error) {
    throw error;
  }

  const result = data as {
    workspace: TWorkspace;
    user_workspace: TUserWorkspace;
  };

  return { data: { workspace: result.workspace, userWorkspace: result.user_workspace } };
}

export async function updateWorkspace(
  workspaceData: TablesUpdate<'workspaces'> & { id: string },
): Promise<TMutation<TWorkspace>> {
  const validatedFields = UpdateWorkspaceSchema.safeParse(workspaceData);
  if (!validatedFields.success) {
    throw new Error('Invalid workspace data');
  }

  const workspace = await updateEntity({
    tableName: 'workspaces',
    entityData: workspaceData,
  });

  return { data: workspace };
}

export async function deleteWorkspace(workspaceId: string): Promise<TMutationDelete> {
  const id = await deleteEntity({ tableName: 'workspaces', entityId: workspaceId });

  return { data: { id } };
}
