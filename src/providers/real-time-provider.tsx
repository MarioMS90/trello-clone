'use client';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useQueryClient } from '@tanstack/react-query';
import { TEntityName } from '@/types/db';
import { getChannels, createChannel } from '@/lib/real-time/utils';
import cacheSyncHandler from '@/lib/real-time/cache-sync-handler';

type TRealTimeContextValue = {
  registerChannel: (entity: TEntityName) => void;
};

const RealTimeContext = createContext<TRealTimeContextValue | null>(null);

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(
    () => () => {
      const channels = getChannels();
      channels.forEach(channel => channel.unsubscribe());
    },
    [],
  );

  const handleSubscription = useCallback(
    async (entity: TEntityName) => {
      queryClient.refetchQueries({ queryKey: [entity] });
    },
    [queryClient],
  );

  const registerChannel = useCallback(
    (entity: TEntityName) => {
      return;
      const channels = getChannels();
      if (channels.some(channel => channel.subTopic === `schema-${entity}-changes`)) {
        return;
      }

      createChannel({
        entity,
        onSubscription: () => handleSubscription(entity),
        onChanges: payload => {
          cacheSyncHandler(queryClient, payload);
        },
      });
    },
    [queryClient, handleSubscription],
  );

  const initialEntities: TEntityName[] = [
    'users',
    'workspaces',
    'members',
    'boards',
    'starred_boards',
  ];
  initialEntities.forEach(entity => {
    registerChannel(entity);
  });

  const contextValue: TRealTimeContextValue = useMemo(
    () => ({
      registerChannel,
      test: 5,
    }),
    [registerChannel],
  );

  return <RealTimeContext.Provider value={contextValue}>{children}</RealTimeContext.Provider>;
}

export function useRealTimeContext(): TRealTimeContextValue {
  const value = useContext(RealTimeContext);
  invariant(value, 'Cannot find real time provider');
  return value;
}
