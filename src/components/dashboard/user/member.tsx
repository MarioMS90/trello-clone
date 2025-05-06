'use client';

import { rolesKeys } from '@/lib/user/queries';
import Avatar from '@/components/ui/avatar';
import CloseIcon from '@/components/icons/close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { deleteMember } from '@/lib/user/actions';
import { TRole, TUserRole } from '@/types/db';

export default function Member({ role }: { role: TUserRole }) {
  const queryClient = useQueryClient();

  const removeMember = useMutation({
    mutationFn: (roleId: string) => deleteMember(roleId),
    onSuccess: ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(rolesKeys.list.queryKey, (old: TRole[]) =>
        old.filter(_role => _role.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return (
    <li className="flex items-center justify-between border-y-1 border-y-white/20 py-3 last:border-t-0">
      <div className="flex items-center gap-4">
        <Avatar
          className="size-8 cursor-default"
          userId={role.id}
          title={`${role.name} (${role.role})`}
        />
        <div>
          <h2 className="font-semibold">{role.name}</h2>
          <p className="text-sm font-light">
            {role.email} ({role.role})
          </p>
        </div>
      </div>
      {role.role !== 'admin' && (
        <button
          className="text-primary flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-gray-300 px-3 py-2 text-sm hover:bg-gray-300 hover:opacity-90"
          type="button"
          onClick={() => removeMember.mutate(role.roleId)}>
          <CloseIcon width={16} height={16} />
          Remove
        </button>
      )}
    </li>
  );
}
