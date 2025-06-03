'use client';

import { useState } from 'react';
import Popover from '@/modules/common/components/ui/popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkspace } from '@/modules/workspace/lib/actions';
import invariant from 'tiny-invariant';
import { workspaceKeys } from '@/modules/workspace/lib/queries';
import { TMember, TWorkspace } from '@/modules/common/types/db';
import CloseIcon from '@/modules/common/components/icons/close';
import { membersKeys } from '@/modules/user/lib/queries';

export function CreateWorkspace() {
  const queryClient = useQueryClient();
  const [isValidForm, setIsValidForm] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { queryKey } = workspaceKeys.list;

  const {
    mutate: createWorkspaceAction,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (name: string) => createWorkspace({ name }),
    onSuccess: ({ data }) => {
      invariant(data);

      setIsValidForm(false);
      setIsPopoverOpen(false);
      queryClient.setQueryData(queryKey, (old: TWorkspace[]) => [...old, { ...data.workspace }]);
      return queryClient.setQueryData(membersKeys.list.queryKey, (old: TMember[]) => {
        if (!old) {
          return undefined;
        }

        return [...old, data.role];
      });
    },
  });

  const formAction = (formData: FormData) => {
    const name = formData.get('name')?.toString().trim();
    if (!name) {
      return;
    }

    createWorkspaceAction(name);
  };

  return (
    <Popover
      popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
      triggerClassName="rounded-sm px-2 py-1.5 h-20 w-44 bg-gray-300 text-sm text-primary justify-center hover:opacity-90 hover:bg-gray-300"
      triggerContent="Create a new workspace"
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}>
      <button
        className="close-popover absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md hover:bg-gray-300"
        type="button"
        onMouseUp={() => setIsPopoverOpen(false)}>
        <span className="pointer-events-none">
          <CloseIcon height={16} />
        </span>
      </button>
      <div className="flex flex-col text-sm text-gray-700">
        <h2 className="mb-1 text-center font-semibold">Create workspace</h2>
        <form action={formAction}>
          <label className="text-xs font-bold" htmlFor="name">
            Workspace title <span className="text-red-500">*</span>
            <input
              name="name"
              className="outline-secondary mt-1 mb-1 w-full rounded-sm border border-gray-500 px-3 py-2"
              required
              onInput={e => {
                setIsValidForm(Boolean(e.currentTarget.value.trim()));
              }}
              type="text"
            />
          </label>
          {isError && <p className="text-xs text-red-500">{error.message}</p>}
          <button
            className="bg-secondary mt-3 w-full cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            type="submit"
            disabled={!isValidForm || isPending}>
            Create
          </button>
        </form>
      </div>
    </Popover>
  );
}
