import { TEntity, TEntityName, TPublicSchema } from '@/types/db';
import { TablesInsert, TablesUpdate } from '@/types/database-types';
import { createClient } from './client';
import { camelizeKeys } from '../utils/utils';

const isServer = typeof window === 'undefined';

export async function getClient() {
  if (isServer) {
    return (await import('./server')).createClient();
  }

  return createClient();
}

export async function getAuthUser() {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  return user;
}

export async function insertEntity<TableName extends TEntityName>({
  tableName,
  entityData,
}: {
  tableName: TableName;
  entityData: TablesInsert<TableName>;
}): Promise<TEntity<TableName>> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from(tableName as keyof TPublicSchema['Tables'])
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
  const supabase = await getClient();

  const { data, error } = await supabase
    .from(tableName as keyof TPublicSchema['Tables'])
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
  const supabase = await getClient();

  const { error } = await supabase.from(tableName).delete().eq('id', entityId);

  if (error) {
    throw error;
  }

  return entityId;
}
