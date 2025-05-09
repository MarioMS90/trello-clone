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

  const member = await insertEntity({
    tableName: 'members',
    entityData: { user_id: user.id, workspace_id: workspaceId, role: 'member' },
  });

  return { data: { user, member } };
}

export async function deleteMember(roleId: string): Promise<TMutationDelete> {
  const id = await deleteEntity({ tableName: 'members', entityId: roleId });

  return { data: { id } };
}
