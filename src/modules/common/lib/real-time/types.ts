import { TEntity, TEntityName } from '@/modules/common/types/db';

export type CacheHandlers<T extends TEntity<TEntityName>> = {
  handleInsert: (entity: T) => void;
  handleUpdate: (entity: T) => void;
  handleDelete: (entity: Partial<T>) => void;
};
