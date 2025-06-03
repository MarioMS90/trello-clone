'use server';

import { TEntity, TEntityName } from '@/modules/common/types/db';
import { TablesInsert, TablesUpdate } from '@/modules/common/types/database-types';
import { camelizeKeys } from '@/modules/common/utils/utils';
import createClient from '@/modules/supabase/server';

export async function insertEntity<TableName extends TEntityName>({
  tableName,
  entityData,
}: {
  tableName: TableName;
  entityData: TablesInsert<TableName>;
}): Promise<TEntity<TableName>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(tableName as TEntityName)
    .insert(entityData)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return camelizeKeys(data) as TEntity<TableName>;
}

export async function updateEntity<TableName extends TEntityName>({
  tableName,
  entityData,
}: {
  tableName: TableName;
  entityData: TablesUpdate<TableName> & { id: string };
}): Promise<TEntity<TableName>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(tableName as TEntityName)
    .update(entityData)
    .eq('id', entityData.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return camelizeKeys(data) as TEntity<TableName>;
}

export async function deleteEntity<TableName extends TEntityName>({
  tableName,
  entityId,
}: {
  tableName: TableName;
  entityId: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(tableName as TEntityName)
    .delete()
    .eq('id', entityId);

  if (error) {
    throw error;
  }

  return entityId;
}
