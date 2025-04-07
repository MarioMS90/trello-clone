'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { TEntityName } from '@/types/db';
import { RealtimeChannel } from '@supabase/supabase-js';
import createChannel from '@/lib/real-time/create-channel';
import cacheSyncHandler from '@/lib/real-time/cache-sync-handler';

type TChannelsState = Partial<Record<TEntityName, RealtimeChannel>>;

type TRealTimeContextValue = {
  channels: TChannelsState;
  registerChannel: (entity: TEntityName) => void;
};

const RealTimeContext = createContext<TRealTimeContextValue | null>(null);

function createInitialChannels(queryClient: QueryClient) {
  const entities: TEntityName[] = [
    'users',
    'workspaces',
    'user_workspaces',
    'boards',
    'starred_boards',
  ];

  return entities.reduce<TChannelsState>((channels, entity) => {
    const channel = createChannel({
      queryClient,
      entity,
      onChanges: payload => cacheSyncHandler(queryClient, payload),
    });

    return { ...channels, [entity]: channel };
  }, {});
}

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [channels, setChannels] = useState<TChannelsState>(() =>
    createInitialChannels(queryClient),
  );

  const registerChannel = useCallback(
    (entity: TEntityName) => {
      setChannels(prev => {
        if (prev[entity]) {
          return prev;
        }

        const channel = createChannel({
          queryClient,
          entity,
          onChanges: payload => cacheSyncHandler(queryClient, payload),
        });

        return { ...prev, [entity]: channel };
      });
    },
    [queryClient],
  );

  const contextValue: TRealTimeContextValue = useMemo(
    () => ({
      channels,
      registerChannel,
    }),
    [channels, registerChannel],
  );

  return <RealTimeContext.Provider value={contextValue}>{children}</RealTimeContext.Provider>;
}

export function useRealTimeContext(): TRealTimeContextValue {
  const value = useContext(RealTimeContext);
  invariant(value, 'Cannot find real time provider');
  return value;
}
