'use client';

import { createBoard, createWorkspace } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { initialState, UserWorkspace } from '@/types/app-types';
import { useEffect, useState } from 'react';
import { SubmitButton } from './buttons';

export function CreateBoardForm({
  workspaceId,
  workspaces,
  onSubmitSuccess,
}: {
  workspaceId?: string;
  workspaces?: UserWorkspace[];
  onSubmitSuccess?: () => void;
}) {
  const createBoardWithId = createBoard.bind(null, workspaceId);
  const [formState, formAction] = useFormState(createBoardWithId, initialState);
  const [isValidForm, setIsValidForm] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setIsValidForm(false);
      formAction(null);
      onSubmitSuccess?.();
    }
  }, [formState.success, formAction, onSubmitSuccess]);

  return (
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
                setIsValidForm(!!e.currentTarget.value.trim());
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
              setIsValidForm(!!e.currentTarget.value.trim());
            }}
            type="text"
          />
        </label>
        {formState?.errors?.name && <p className="text-xs text-red-500">{formState.errors.name}</p>}
        <SubmitButton isValidForm={isValidForm} />
      </form>
    </div>
  );
}

export function CreateWorkspaceForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const [formState, formAction] = useFormState(createWorkspace, initialState);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);

  useEffect(() => {
    if (formState.success) {
      setIsValidForm(false);
      formAction(null);
      onSubmitSuccess?.();
    }
  }, [formState.success, formAction, onSubmitSuccess]);

  return (
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
        {formState.errors?.name && <p className="text-xs text-red-500">{formState.errors.name}</p>}
        <SubmitButton isValidForm={isValidForm} />
      </form>
    </div>
  );
}
