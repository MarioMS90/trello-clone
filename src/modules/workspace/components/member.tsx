'use client';

import { membersKeys } from '@/modules/user/lib/queries';
import Avatar from '@/modules/common/components/ui/avatar';
import CloseIcon from '@/modules/common/components/icons/close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { deleteMember } from '@/modules/user/lib/actions';
import { TMember, TUserMember } from '@/modules/common/types/db';

export default function Member({ member }: { member: TUserMember }) {
  const queryClient = useQueryClient();

  const removeMember = useMutation({
    mutationFn: (roleId: string) => deleteMember(roleId),
    onSuccess: ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(membersKeys.list.queryKey, (old: TMember[]) =>
        old.filter(_member => _member.id !== data.id),
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
          user={member}
          title={`${member.name} (${member.role})`}
        />
        <div>
          <h2 className="font-semibold">{member.name}</h2>
          <p className="text-sm font-light">
            {member.email} ({member.role})
          </p>
        </div>
      </div>
      {member.role !== 'admin' && (
        <button
          className="text-primary flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-gray-300 px-3 py-2 text-sm hover:bg-gray-300 hover:opacity-90"
          type="button"
          onClick={() => removeMember.mutate(member.roleId)}>
          <CloseIcon width={16} height={16} />
          Remove
        </button>
      )}
    </li>
  );
}
