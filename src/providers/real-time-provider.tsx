'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import invariant from 'tiny-invariant';
import { useQueryClient } from '@tanstack/react-query';
import { MutationType, TEntityName } from '@/types/db';
import { getChannels, createChannel } from '@/lib/real-time/utils';
import cacheSyncHandler from '@/lib/real-time/cache-sync-handler';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Tables } from '@/types/database-types';
import { camelizeKeys } from '@/lib/utils/utils';

type TResolver =
  | {
      entityName: TEntityName;
      mutationType: MutationType.INSERT | MutationType.DELETE;
      match: { id: string };
      resolve: (value: unknown) => void;
    }
  | {
      entityName: TEntityName;
      mutationType: MutationType.UPDATE;
      match: { id: string; updatedAt: string };
      resolve: (value: unknown) => void;
    };

type TRealTimeContextValue = {
  registerChannel: (entity: TEntityName) => void;
  awaitCacheSync: (subscription: Omit<TResolver, 'resolve'>) => void;
};

const RealTimeContext = createContext<TRealTimeContextValue | null>(null);

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const resolvers = useRef<TResolver[]>([]);

  useEffect(
    () => () => {
      const channels = getChannels();
      channels.forEach(channel => channel.unsubscribe());
    },
    [],
  );

  const processResolvers = useCallback(
    (payload: RealtimePostgresChangesPayload<Tables<TEntityName>>) => {
      const { table, eventType, new: newData, old: oldData } = payload;
      resolvers.current = resolvers.current.filter(
        ({ entityName, mutationType, match, resolve }) => {
          if (entityName !== table || eventType !== mutationType) {
            return true;
          }

          const data =
            eventType === MutationType.INSERT ? camelizeKeys(newData) : camelizeKeys(oldData);

          const isMatch =
            mutationType === MutationType.UPDATE
              ? data.id === match.id && data.updatedAt === match.updatedAt
              : data.id === match.id;

          if (isMatch) {
            resolve(null);
            return false;
          }

          return true;
        },
      );
    },
    [],
  );

  const handleSubscription = useCallback(
    async (entity: TEntityName) => {
      await queryClient.refetchQueries({ queryKey: [entity] });
      resolvers.current = resolvers.current.filter(({ entityName, resolve }) => {
        if (entityName !== entity) {
          return true;
        }
        resolve(null);
        return false;
      });
    },
    [queryClient],
  );

  const registerChannel = useCallback(
    (entity: TEntityName) => {
      const channels = getChannels();
      if (channels.some(channel => channel.subTopic === `schema-${entity}-changes`)) {
        return;
      }

      createChannel({
        entity,
        onSubscription: () => handleSubscription(entity),
        onChanges: payload => {
          cacheSyncHandler(queryClient, payload);
          processResolvers(payload);
        },
      });
    },
    [queryClient, handleSubscription, processResolvers],
  );

  const awaitCacheSync = useCallback(
    (resolver: Omit<TResolver, 'resolve'>) =>
      new Promise(res => {
        resolvers.current = [...resolvers.current, { ...resolver, resolve: res } as TResolver];
      }),
    [],
  );

  const initialEntities: TEntityName[] = [
    'users',
    'workspaces',
    'user_workspaces',
    'boards',
    'starred_boards',
  ];
  initialEntities.forEach(entity => {
    registerChannel(entity);
  });

  const contextValue: TRealTimeContextValue = useMemo(
    () => ({
      registerChannel,
      awaitCacheSync,
    }),
    [registerChannel, awaitCacheSync],
  );

  return <RealTimeContext.Provider value={contextValue}>{children}</RealTimeContext.Provider>;
}

export function useRealTimeContext(): TRealTimeContextValue {
  const value = useContext(RealTimeContext);
  invariant(value, 'Cannot find real time provider');
  return value;
}
