'use client';

import { useEffect, useState } from 'react';
import { createBoard, createWorkspace } from '@/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { initialState } from '@/types/app-types';
import Popover from '../ui/popover';

export function CreateWorkspacePopover() {
  const [formState, formAction] = useFormState(createWorkspace, initialState);
  const [isValidForm, setIsValidForm] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setPopoverOpen(false);
      setIsValidForm(false);
      formAction(null);
    }
  }, [formState, formAction]);

  return (
    <Popover text="Create a new workspace" open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                setIsValidForm(!!e.currentTarget.value.trim());
              }}
              type="text"
            />
          </label>
          {formState.errors?.name && (
            <p className="text-xs text-red-500">{formState.errors.name}</p>
          )}
          <SubmitButton isValidForm={isValidForm} />
        </form>
      </div>
    </Popover>
  );
}

export function CreateBoardPopover({ workspaceId }: { workspaceId: string }) {
  const createBoardWithId = createBoard.bind(null, workspaceId);
  const [formState, formAction] = useFormState(createBoardWithId, initialState);
  const [isValidForm, setIsValidForm] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setPopoverOpen(false);
      setIsValidForm(false);
      formAction(null);
    }
  }, [formState, formAction]);

  return (
    <Popover text="Create a new board" open={popoverOpen} onOpenChange={setPopoverOpen}>
      <div className="flex flex-col text-sm text-gray-700">
        <h2 className="mb-1 text-center font-semibold">Create board</h2>
        <form action={formAction}>
          <label className="text-xs font-bold" htmlFor="name">
            Board title <span className="text-red-500">*</span>
            <input
              name="name"
              className="mb-1 mt-1 w-full rounded border border-gray-500 px-3 py-2 outline-secondary"
              required
              onInput={e => {
                setIsValidForm(!!e.currentTarget.value.trim());
              }}
              type="text"
            />
          </label>
          {formState?.errors?.name && (
            <p className="text-xs text-red-500">{formState.errors.name}</p>
          )}
          <SubmitButton isValidForm={isValidForm} />
        </form>
      </div>
    </Popover>
  );
}

function SubmitButton({ isValidForm }: { isValidForm: boolean }) {
  const { pending: isPending } = useFormStatus();

  return (
    <button
      className="mt-3 w-full rounded bg-secondary px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      type="submit"
      disabled={!isValidForm || isPending}>
      Create
    </button>
  );
}
