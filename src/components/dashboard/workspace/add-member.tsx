'use client';

import { membersKeys, userKeys } from '@/lib/user/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { createMember } from '@/lib/user/actions';
import { TMember, TUser } from '@/types/db';
import AddUserIcon from '@/components/icons/add-user';
import { useClickAway } from '@uidotdev/usehooks';
import { useState } from 'react';
import CloseIcon from '@/components/icons/close';

export default function CreateMember({ workspaceId }: { workspaceId: string }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const clickAwayRef = useClickAway<HTMLDivElement>(event => {
    if (!(event instanceof MouseEvent)) {
      return;
    }

    if (event.button !== 0 && event.button !== 2) {
      return;
    }

    setIsOpen(false);
  });

  const addMember = useMutation({
    mutationFn: (email: string) => createMember(email, workspaceId),
    onSuccess: ({ data }) => {
      invariant(data);

      setIsOpen(false);
      queryClient.setQueryData(userKeys.list.queryKey, (old: TUser[]) =>
        old.some(({ id }) => id === data.user.id) ? old : [...old, data.user],
      );
      return queryClient.setQueryData(membersKeys.list.queryKey, (old: TMember[]) => [
        ...old,
        data.member,
      ]);
    },
  });

  const formAction = (formData: FormData) => {
    const email = formData.get('email')?.toString().trim();
    if (!email) {
      return;
    }

    addMember.mutate(email);
  };

  return (
    <>
      <button
        className="text-primary flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-gray-300 px-3 py-2 text-sm hover:bg-gray-300 hover:opacity-90"
        type="button"
        onClick={() => setIsOpen(true)}>
        <AddUserIcon width={16} height={16} />
        Invite Workspace members
      </button>
      {isOpen && (
        <div className="scrollbar-stable text-primary fixed top-0 left-0 z-50 h-dvh w-dvw bg-black/75">
          <div
            className="center-xy fixed w-auto rounded-xl bg-white p-6 md:w-[584px]"
            ref={clickAwayRef}>
            <button
              className="close-popover absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md hover:bg-gray-300"
              type="button"
              onMouseUp={() => setIsOpen(false)}>
              <span className="pointer-events-none">
                <CloseIcon height={16} />
              </span>
            </button>
            <div className="flex flex-col text-sm text-gray-700">
              <h2 className="mb-1 text-center text-xl">Invite to workspace</h2>
              <form action={formAction}>
                <label className="text-sm" htmlFor="name">
                  User email
                  <input
                    name="email"
                    className="outline-secondary mt-1 mb-1 w-full rounded-sm border border-gray-500 px-3 py-2"
                    required
                    onInput={e => {
                      setIsValidForm(Boolean(e.currentTarget.value.trim()));
                    }}
                    type="text"
                  />
                </label>
                {addMember.isError && (
                  <p className="text-xs text-red-500">{addMember.error.message}</p>
                )}
                <button
                  className="bg-secondary mt-3 w-full cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                  type="submit"
                  disabled={!isValidForm || addMember.isPending}>
                  Add member
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
