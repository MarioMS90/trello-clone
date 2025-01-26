'use client';

import { useActionState, useEffect, useState } from 'react';
import { createWorkspaceAction } from '@/lib/actions';
import { initialState } from '@/types/types';
import Popover from '@/components/ui/popover';

export function CreateWorkspace() {
  const [formState, formAction, isPending] = useActionState(createWorkspaceAction, initialState);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setIsValidForm(false);
      setIsPopoverOpen(false);
    }
  }, [formState.success]);

  return (
    <Popover
      popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
      triggerClassName="
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
              "
      triggerContent="Create a new workspace"
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      addCloseButton>
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
  );
}
