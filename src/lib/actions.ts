'use server';

import { revalidatePath } from 'next/cache';
import { ActionState, initialState, Role } from '@/types/app-types';
import { CreateBoardSchema, CreateWorkspaceSchema } from '@/schemas/workspace-schemas';
import { createClient } from './supabase/server';

export async function createWorkspace(prevState: ActionState, formData: FormData | null) {
  if (!formData) {
    return initialState;
  }

  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Workspace.',
    };
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { data, error: workspaceError } = await supabase
    .from('workspace')
    .insert({ name: validatedFields.data.name })
    .select();

  if (workspaceError) throw new Error(workspaceError.message);

  const { error: userWorkspaceError } = await supabase
    .from('user_workspace')
    .insert({ user_id: user.id, workspace_id: data[0].id, role: Role.Admin })
    .select();

  if (userWorkspaceError) {
    await supabase.from('workspace').delete().eq('id', data[0].id);
    throw new Error(userWorkspaceError.message);
  }

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}

export async function createBoard(
  workspaceIdParam: string,
  prevState: ActionState,
  formData: FormData | null,
) {
  if (!formData) {
    return initialState;
  }

  const validatedFields = CreateBoardSchema.safeParse({
    workspaceId: workspaceIdParam,
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Board.',
    };
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not logged in');

  const { error } = await supabase
    .from('board')
    .insert({ name: validatedFields.data.name, workspace_id: validatedFields.data.workspaceId });

  if (error) throw new Error(error.message);

  revalidatePath('/(dashboard)', 'layout');
  return { success: true };
}
