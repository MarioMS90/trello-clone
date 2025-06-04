import { deleteEntity, insertEntity } from '@/modules/common/lib/supabase/server-utils';
import { fetchUser } from '@/modules/user/lib/queries';

export async function createMember(email: string, workspaceId: string) {
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

export async function deleteMember(roleId: string) {
  const id = await deleteEntity({ tableName: 'members', entityId: roleId });

  return { data: { id } };
}
