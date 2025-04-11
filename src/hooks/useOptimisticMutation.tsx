'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function useOptimisticMutation<
  TState,
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>({
  state,
  updater,
  options,
}: {
  state: TState;
  updater: (current: TState, variables: TVariables) => TState;
  options: UseMutationOptions<TData, TError, TVariables, TContext>;
}) {
  const resolveRef = useRef<((value: null) => void) | null>(null);

  useEffect(() => {
    if (!resolveRef.current) {
      return;
    }

    resolveRef.current(null);
    resolveRef.current = null;
  }, [state]);

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSuccess: async (data, variables, context) => {
      if (options.onSuccess) {
        await options.onSuccess(data, variables, context);
      }

      const waitForChange = new Promise(resolve => {
        resolveRef.current = resolve;
      });
      await waitForChange;
    },
  });

  const optimisticState = mutation.isPending ? updater(state, mutation.variables) : state;

  return [mutation, optimisticState] as const;
}
