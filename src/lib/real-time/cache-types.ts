import { TEntity, TEntityName } from '@/types/db';

export type CacheHandlers<T extends TEntity<TEntityName>> = {
  handleInsert: (entity: T) => void;
  handleUpdate: (entity: T) => void;
  handleDelete: (entity: T) => void;
};
