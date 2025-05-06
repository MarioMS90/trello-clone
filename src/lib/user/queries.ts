import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { TRole, TUser, TUserRole } from '@/types/db';
import { useMemo } from 'react';
import { getAuthUser, getClient } from '../supabase/utils';

// This is an example of a subquery-like operation:
// fetch all roles associated with these workspaces.
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

const fetchRoles = async () => {
  const supabase = await getClient();
  const user = await getAuthUser();

  const { data } = await supabase
    .from('roles')
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
    queryFn: () => fetchUsers(),
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

export const rolesKeys = createQueryKeys('roles', {
  list: {
    queryKey: null,
    queryFn: () => fetchRoles(),
  },
});

export const useCurrentUser = () => useSuspenseQuery({ ...userKeys.current, staleTime: 0 });

const useUsersQuery = <TData = TUser[]>(select?: (data: TUser[]) => TData) =>
  useSuspenseQuery({
    ...userKeys.list,
    select,
  });

export const useUser = (userId: string) =>
  useUsersQuery(users => {
    const index = users.findIndex(user => user.id === userId);
    return users[index];
  });

const useRolesQuery = <TData = TRole[]>(select?: (data: TRole[]) => TData) =>
  useSuspenseQuery({
    ...rolesKeys.list,
    select,
  });

export const useRoles = (workspaceId: string) => {
  const { data: roles } = useRolesQuery(_roles =>
    _roles.filter(role => role.workspaceId === workspaceId),
  );
  const rolesMap = useMemo(() => new Map(roles.map(role => [role.userId, role])), [roles]);
  const { data: users } = useUsersQuery(_users => _users.filter(user => rolesMap.has(user.id)));

  return useMemo(
    () =>
      users
        .reduce<TUserRole[]>((_users, user) => {
          const role = rolesMap.get(user.id);
          if (!role) {
            return _users;
          }

          return [..._users, { ...user, roleId: role.id, role: role.role }];
        }, [])
        .toSorted((a, b) => (a.role === 'admin' ? 0 : 1) - (b.role === 'admin' ? 0 : 1)),
    [users, rolesMap],
  );
};
