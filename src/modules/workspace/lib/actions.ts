'use server';

import { TMember, TWorkspace } from '@/modules/common/types/db';
import {
  CreateWorkspaceSchema,
  UpdateWorkspaceSchema,
} from '@/modules/common/schemas/workspace-schemas';
import { TablesInsert, TablesUpdate } from '@/modules/common/types/database-types';
import { deleteEntity, updateEntity } from '@/modules/common/lib/supabase/server-utils';
import createClient from '@/modules/common/lib/supabase/server';

export async function createWorkspace(workspaceData: TablesInsert<'workspaces'>) {
  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: workspaceData.name,
  });
  if (!validatedFields.success) {
    if (!validatedFields.success) {
      throw new Error('Missing fields. Failed to create workspace.');
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('create_workspace_with_admin_access', {
    workspace_name: validatedFields.data.name,
  });

  if (error) {
    throw error;
  }

  const result = data as {
    workspace: TWorkspace;
    role: TMember;
  };

  return { data: { workspace: result.workspace, role: result.role } };
}

export async function updateWorkspace(workspaceData: TablesUpdate<'workspaces'> & { id: string }) {
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

export async function deleteWorkspace(workspaceId: string) {
  const id = await deleteEntity({ tableName: 'workspaces', entityId: workspaceId });

  return { data: { id } };
}
