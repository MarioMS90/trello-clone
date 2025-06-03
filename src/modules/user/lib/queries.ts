import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { TMember, TUser, TUserMember } from '@/modules/common/types/db';
import { useMemo } from 'react';
import { getAuthUser, getClient } from '@/modules/supabase/utils';

// This is an example of a subquery-like operation:
// fetch all members associated with these workspaces.
export const fetchUsers = async () => {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data } = await supabase
    .from('users')
    .select(
      `
      id,
      name,
      email,
      createdAt: created_at,
      updatedAt: updated_at,
      workspaces!inner(users!inner())
    `,
    )
    .eq('workspaces.users.id', user.id)
    .throwOnError();

  return data;
};

export const fetchUser = async ({
  eqColumn,
  eqValue,
}: {
  eqColumn: keyof TUser;
  eqValue: string;
}) => {
  const supabase = await getClient();

  return supabase
    .from('users')
    .select(
      `
      id,
      name,
      email,
      createdAt: created_at,
      updatedAt: updated_at
    `,
    )
    .eq(eqColumn, eqValue)
    .single();
};

const fetchMembers = async () => {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data } = await supabase
    .from('members')
    .select(
      `
      id,
      userId: user_id,
      workspaceId: workspace_id,
      role,
      createdAt: created_at,
      updatedAt: updated_at,
      workspaces!inner(users!inner())
    `,
    )
    .eq('workspaces.users.id', user.id)
    .throwOnError();

  return data;
};

export const userKeys = createQueryKeys('users', {
  list: {
    queryKey: null,
    queryFn: fetchUsers,
  },
  current: {
    queryKey: null,
    queryFn: async () => {
      const user = await getAuthUser();
      const { data, error } = await fetchUser({
        eqColumn: 'id',
        eqValue: user.id,
      });

      if (error) {
        throw error;
      }

      return data;
    },
  },
});

export const membersKeys = createQueryKeys('members', {
  list: {
    queryKey: null,
    queryFn: fetchMembers,
  },
});

const useUsersQuery = <TData = TUser[]>(select?: (data: TUser[]) => TData) =>
  useSuspenseQuery({
    ...userKeys.list,
    select,
  });

const useMembersQuery = <TData = TMember[]>(select?: (data: TMember[]) => TData) =>
  useSuspenseQuery({
    ...membersKeys.list,
    select,
  });

export const useCurrentUser = () => useSuspenseQuery({ ...userKeys.current, staleTime: 0 });

export const useMembers = (workspaceId: string) => {
  const { data: members } = useMembersQuery(_members =>
    _members.filter(member => member.workspaceId === workspaceId),
  );
  const membersMap = useMemo(
    () => new Map(members.map(member => [member.userId, member])),
    [members],
  );
  const { data: users } = useUsersQuery(_users => _users.filter(user => membersMap.has(user.id)));

  return useMemo(
    () =>
      users
        .reduce<TUserMember[]>((_users, user) => {
          const member = membersMap.get(user.id);
          if (!member) {
            return _users;
          }

          return [..._users, { ...user, roleId: member.id, role: member?.role }];
        }, [])
        .toSorted((a, b) => (a.role === 'admin' ? 0 : 1) - (b.role === 'admin' ? 0 : 1)),
    [users, membersMap],
  );
};

export const useMember = (userId: string) => {
  const { data: member } = useMembersQuery(members => {
    const index = members.findIndex(_member => _member.userId === userId);
    return members[index];
  });

  const { data: user } = useUsersQuery(users => {
    const index = users.findIndex(_user => _user.id === userId);
    return users[index];
  });

  return { ...user, roleId: member.id, role: member?.role };
};
