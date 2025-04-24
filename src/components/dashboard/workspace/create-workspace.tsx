'use client';

import { useState } from 'react';
import Popover from '@/components/ui/popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkspace } from '@/lib/workspace/actions';
import invariant from 'tiny-invariant';
import { userWorkspaceKeys, workspaceKeys } from '@/lib/workspace/queries';
import { TUserWorkspace, TWorkspace } from '@/types/db';
import CloseIcon from '@/components/icons/close';

export function CreateWorkspace() {
  const queryClient = useQueryClient();
  const [isValidForm, setIsValidForm] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { queryKey } = workspaceKeys.list();

  const {
    mutate: createWorkspaceAction,
    isPending,
    data: result,
  } = useMutation({
    mutationFn: async (name: string) => createWorkspace({ name }),
    onSuccess: async ({ data, errors }) => {
      invariant(data);

      if (!errors) {
        setIsValidForm(false);
        setIsPopoverOpen(false);
      }

      queryClient.setQueryData(queryKey, (old: TWorkspace[]) => [...old, { ...data.workspace }]);
      return queryClient.setQueryData(
        userWorkspaceKeys.list().queryKey,
        (old: TUserWorkspace[]) => {
          if (!old) {
            return undefined;
          }

          return [...old, { ...data.userWorkspace }];
        },
      );
    },
    onError: () => {
      alert('An error occurred while creating the element');
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
      triggerClassName="rounded px-2 py-1.5 h-20 w-44 bg-gray-300 text-sm text-primary justify-center hover:opacity-90 hover:bg-gray-300"
      triggerContent="Create a new workspace"
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}>
      <button
        className="close-popover absolute right-2 top-2 flex size-7 items-center justify-center rounded-md hover:bg-gray-300"
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
              className="mb-1 mt-1 w-full rounded border border-gray-500 px-3 py-2 outline-secondary"
              required
              onInput={e => {
                setIsValidForm(Boolean(e.currentTarget.value.trim()));
              }}
              type="text"
            />
          </label>
          {result?.errors?.name && <p className="text-xs text-red-500">{result.errors.name}</p>}
          <button
            className="mt-3 w-full rounded bg-secondary px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            type="submit"
            disabled={!isValidForm || isPending}>
            Create
          </button>
        </form>
      </div>
    </Popover>
  );
}
