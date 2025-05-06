import { TMutationDelete, TMutationMemberInsert } from '@/types/db';
import { deleteEntity, insertEntity } from '../supabase/server-utils';
import { fetchUser } from './queries';

export async function createMember(
  email: string,
  workspaceId: string,
): Promise<TMutationMemberInsert> {
  const { data: user, error } = await fetchUser({
    eqColumn: 'email',
    eqValue: email,
  });

  if (error) {
    throw new Error('User not found');
  }

  const role = await insertEntity({
    tableName: 'roles',
    entityData: { user_id: user.id, workspace_id: workspaceId, role: 'member' },
  });

  return { data: { user, role } };
}

export async function deleteMember(roleId: string): Promise<TMutationDelete> {
  const id = await deleteEntity({ tableName: 'roles', entityId: roleId });

  return { data: { id } };
}
