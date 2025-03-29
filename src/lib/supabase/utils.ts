import { TPublicSchema } from '@/types/db';
import { redirect } from 'next/navigation';
import { TablesUpdate } from '@/types/database-types';
import { createClient } from './client';

const isServer = typeof window === 'undefined';

export const revalidate = 60;

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

export async function updateEntity<TableName extends keyof TPublicSchema['Tables']>({
  tableName,
  entityData,
  redirectUrl,
}: {
  tableName: keyof TPublicSchema['Tables'];
  entityData: TablesUpdate<TableName> & { id: string };
  redirectUrl?: string;
}) {
  const supabase = await getClient();

  const { error } = await supabase
    .from(tableName as keyof TPublicSchema['Tables'])
    .update(entityData)
    .eq('id', entityData.id);

  if (error) {
    throw error;
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

export async function deleteEntity<TableName extends keyof TPublicSchema['Tables']>({
  tableName,
  entityId,
  redirectUrl,
}: {
  tableName: TableName;
  entityId: string;
  redirectUrl?: string;
}) {
  const supabase = await getClient();

  const { error } = await supabase.from(tableName).delete().eq('id', entityId);

  if (error) {
    throw error;
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
