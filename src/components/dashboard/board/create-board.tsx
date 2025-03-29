'use client';

import { useActionState, useEffect, useState } from 'react';
import { createBoard } from '@/lib/board/actions';
import { initialActionState, TWorkspace } from '@/types/db';
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
  const createBoardWithId = createBoard.bind(null, workspaceId, redirectToNewBoard);
  const [formState, formAction, isPending] = useActionState(createBoardWithId, initialActionState);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setIsValidForm(false);
      setIsPopoverOpen(false);
    }
  }, [formState.success]);

  return (
    <div className="inline-block">
      <Popover
        popoverClassName={popoverClassName}
        triggerClassName={
          triggerClassName ??
          `
            rounded 
            px-2 
            py-1.5 
            h-20 
            w-44 
            bg-gray-300 
            text-sm 
            text-primary 
            justify-center 
            hover:opacity-90 
            hover:bg-gray-300 
          `
        }
        triggerContent={buttonText || 'Create a new board'}
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        addCloseButton>
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
                    <option key={id} value={id}>
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
            {formState?.errors?.name && (
              <p className="text-xs text-red-500">{formState.errors.name}</p>
            )}
            <button
              className="
            mt-3 
            w-full 
            rounded 
            bg-secondary 
            px-3 
            py-2 
            text-sm 
            font-medium 
            text-white 
            disabled:cursor-not-allowed 
            disabled:bg-gray-200 
            disabled:text-gray-400
          "
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
