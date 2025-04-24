'use client';

import { useState } from 'react';
import { createBoard } from '@/lib/board/actions';
import { TBoard, TWorkspace } from '@/types/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boardKeys } from '@/lib/board/queries';
import invariant from 'tiny-invariant';
import { useRouter } from 'next/navigation';
import CloseIcon from '@/components/icons/close';
import Popover from '../../ui/popover';

export function CreateBoard({
  workspaceId,
  workspaces,
  popoverClassName,
  triggerClassName,
  buttonText,
  redirectToNewBoard = false,
}: {
  workspaceId?: string;
  workspaces?: TWorkspace[];
  popoverClassName?: string;
  triggerClassName?: string;
  buttonText?: React.ReactNode;
  redirectToNewBoard?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isValidForm, setIsValidForm] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { queryKey } = boardKeys.list();

  const {
    mutate: createBoardMutation,
    isPending,
    data: result,
  } = useMutation({
    mutationFn: async ({
      name,
      selectedWorkspaceId,
    }: {
      name: string;
      selectedWorkspaceId?: string;
    }) => {
      const targetWorkspaceId = workspaceId ?? selectedWorkspaceId;
      if (!targetWorkspaceId) {
        throw new Error('No workspace selected');
      }

      return createBoard({ name, workspace_id: targetWorkspaceId });
    },
    onSuccess: async ({ data, errors }) => {
      invariant(data);

      if (redirectToNewBoard) {
        router.push(`/boards/${data.id}`);
      }

      if (!errors) {
        setIsValidForm(false);
        setIsPopoverOpen(false);
      }

      return queryClient.setQueryData(queryKey, (old: TBoard[]) => [...old, { ...data }]);
    },
    onError: () => {
      alert('An error occurred while creating the element');
    },
  });

  const formAction = (formData: FormData) => {
    const name = formData.get('name')?.toString().trim();
    const selectedWorkspaceId = formData.get('workspace-id')?.toString().trim();
    if (!name) {
      return;
    }

    createBoardMutation({ name, selectedWorkspaceId });
  };

  return (
    <div className="inline-block">
      <Popover
        popoverClassName={popoverClassName}
        triggerClassName={
          triggerClassName ??
          'rounded px-2 py-1.5 h-20 w-44 bg-gray-300 text-sm text-primary justify-center hover:opacity-90 hover:bg-gray-300'
        }
        triggerContent={buttonText || 'Create a new board'}
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
          <h2 className="mb-1 text-center font-semibold">Create board</h2>
          <form action={formAction}>
            {workspaces && (
              <label className="text-xs font-bold" htmlFor="workspaceId">
                Workspace
                <select
                  name="workspace-id"
                  className="mb-1 mt-1 w-full rounded border border-gray-500 px-3 py-2 outline-secondary"
                  required
                  onInput={e => {
                    setIsValidForm(Boolean(e.currentTarget.value.trim()));
                  }}>
                  <option value="">Select a workspace</option>
                  {workspaces.map(({ id, name }) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="text-xs font-bold" htmlFor="name">
              Board title <span className="text-red-500">*</span>
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
    </div>
  );
}
