import { TPublicSchema } from '@/types/db';
import { TablesInsert, TablesUpdate } from '@/types/database-types';
import { createClient } from './client';

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

export async function insertEntity<TableName extends keyof TPublicSchema['Tables']>({
  tableName,
  entityData,
}: {
  tableName: keyof TPublicSchema['Tables'];
  entityData: TablesInsert<TableName>;
}) {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from(tableName as keyof TPublicSchema['Tables'])
    .insert(entityData)
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updateEntity<TableName extends keyof TPublicSchema['Tables']>({
  tableName,
  entityData,
}: {
  tableName: keyof TPublicSchema['Tables'];
  entityData: TablesUpdate<TableName> & { id: string };
}) {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from(tableName as keyof TPublicSchema['Tables'])
    .update(entityData)
    .eq('id', entityData.id)
    .select('updated_at')
    .single();

  if (error) {
    throw error;
  }

  return data.updated_at;
}

export async function deleteEntity<TableName extends keyof TPublicSchema['Tables']>({
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
}
