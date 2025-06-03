'use client';

import { useState } from 'react';
import { createBoard } from '@/modules/board/lib/actions';
import { TBoard, TWorkspace } from '@/modules/common/types/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boardKeys } from '@/modules/board/lib/queries';
import invariant from 'tiny-invariant';
import { useRouter } from 'next/navigation';
import CloseIcon from '@/modules/common/components/icons/close';
import Popover from '@/modules/common/components/ui/popover';

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
  const { queryKey } = boardKeys.list;

  const {
    mutate: createBoardMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ name, selectedWorkspaceId }: { name: string; selectedWorkspaceId?: string }) => {
      const targetWorkspaceId = workspaceId ?? selectedWorkspaceId;
      if (!targetWorkspaceId) {
        throw new Error('No workspace selected');
      }

      return createBoard({ name, workspace_id: targetWorkspaceId });
    },
    onSuccess: ({ data }) => {
      invariant(data);

      if (redirectToNewBoard) {
        router.push(`/boards/${data.id}`);
      }

      setIsValidForm(false);
      setIsPopoverOpen(false);
      return queryClient.setQueryData(queryKey, (old: TBoard[]) => [...old, { ...data }]);
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
          'rounded-sm px-2 py-1.5 h-20 w-44 bg-gray-300 text-sm text-primary justify-center hover:opacity-90 hover:bg-gray-300'
        }
        triggerContent={buttonText || 'Create a new board'}
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
          <h2 className="mb-1 text-center font-semibold">Create board</h2>
          <form action={formAction}>
            {workspaces && (
              <label className="text-xs font-bold" htmlFor="workspaceId">
                Workspace
                <select
                  name="workspace-id"
                  className="outline-secondary mt-1 mb-1 w-full rounded-sm border border-gray-500 px-3 py-2"
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
    </div>
  );
}
