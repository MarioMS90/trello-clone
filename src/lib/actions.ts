'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Role } from '@/types/app-types';
import { createClient } from './supabase/server';

export type ActionState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export async function createWorkspace(prevState: ActionState, formData: FormData) {
  revalidatePath('/workspaces');
  redirect('/workspaces');
}

export async function testAction() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('workspace')
    .insert({ name: 'Prueba de nuevo workspace' })
    .select();

  if (error) throw new Error(error.message);

  const { data: data2, error: error2 } = await supabase
    .from('user_workspace')
    .insert({ user_id: user.id, workspace_id: data[0].id, role: Role.Admin })
    .select();

  revalidatePath('/workspaces');
  return redirect('/workspaces');
}
