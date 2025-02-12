'use client';

import { TWorkspace } from '@/types/types';
import { Draft } from 'immer';
import { RequireAtLeastOne } from 'type-fest';
import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type EntitySlice<T extends { id: string }> = {
  data: {
    allIds: string[];
    byId: Record<string, T>;
  };

  actions: {
    add: (entity: Draft<T>) => void;
    update: (entity: Draft<RequireAtLeastOne<T, 'id'>>) => void;
    remove: (id: string) => void;
  };
};

export const getEntitySliceCreator = <T extends { id: string }>(
  entities: T[],
): StateCreator<EntitySlice<T>, [], [['zustand/immer', never]]> =>
  immer(set => ({
    data: {
      allIds: entities.map(entity => entity.id),
      byId: entities.reduce((byId, entity) => ({ ...byId, [entity.id]: entity }), {}),
    },
    actions: {
      add: entity =>
        set(({ data: { allIds, byId } }) => {
          allIds.push(entity.id);
          byId[entity.id] = entity;
        }),
      update: entity =>
        set(({ data: { byId } }) => {
          byId[entity.id] = { ...byId[entity.id], ...entity };
        }),
      remove: workspaceId =>
        set(({ data }) => {
          data.allIds = data.allIds.filter(id => id !== workspaceId);
          delete data.byId[workspaceId];
        }),
    },
  }));

const workspace: TWorkspace = {
  id: '1',
  name: 'test',

  createdAt: 'asd',
};
