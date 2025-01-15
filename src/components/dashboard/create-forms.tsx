'use client';

import { useActionState, useEffect, useState } from 'react';
import { createBoardAction, createWorkspaceAction } from '@/lib/actions';
import { initialState, UserWorkspace } from '@/types/types';

export function CreateBoardForm({
  workspaceId,
  workspaces,
}: {
  workspaceId?: string;
  workspaces?: UserWorkspace[];
}) {
  const createBoardWithId = createBoardAction.bind(null, workspaceId);
  const [formState, formAction, isPending] = useActionState(createBoardWithId, initialState);
  const [isValidForm, setIsValidForm] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setIsValidForm(false);
    }
  }, [formState.success]);

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
  );
}

export function CreateWorkspaceForm() {
  const [formState, formAction, isPending] = useActionState(createWorkspaceAction, initialState);
  const [isValidForm, setIsValidForm] = useState(false);

  useEffect(() => {
    if (formState.success) {
      setIsValidForm(false);
    }
  }, [formState.success]);

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
  );
}
