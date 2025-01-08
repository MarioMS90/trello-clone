'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database, PublicSchema } from '@/types/database-types';
import { DBClient, Subset, SubsetWithId } from '@/types/app-types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function execQuery<T>(
  query: (supabase: DBClient) => Promise<PostgrestSingleResponse<T>>,
): Promise<T> {
  const supabase = await createClient();

  const { data, error } = await query(supabase);

  if (error) {
    throw error;
  }

  return data;
}

export async function insertEntity<T>(entity: Subset<T>, TableName: keyof PublicSchema['Tables']) {
  return execQuery(async supabase => supabase.from(TableName).insert(entity));
}

export async function updateEntity<T extends { id: string }>(
  entity: SubsetWithId<T>,
  TableName: keyof PublicSchema['Tables'],
  options?: { revalidateParams?: [string, 'layout' | 'page'] },
) {
  await execQuery(async supabase => supabase.from(TableName).update(entity).eq('id', entity.id));

  if (options?.revalidateParams) {
    revalidatePath(...options.revalidateParams);
  }
}

export async function deleteEntity(
  entityId: string,
  TableName: keyof PublicSchema['Tables'],
  options?: { revalidateParams?: [string, 'layout' | 'page'] },
) {
  await execQuery(async supabase => supabase.from(TableName).delete().eq('id', entityId));

  if (options?.revalidateParams) {
    revalidatePath(...options.revalidateParams);
  }
}
