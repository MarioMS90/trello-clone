'use server';

import { TActionState, initialState, TPublicSchema } from '@/types/types';
import {
  CreateBoardSchema,
  CreateListSchema,
  CreateWorkspaceSchema,
} from '@/schemas/workspace-schemas';
import { TablesUpdate } from '@/types/database-types';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { revalidateDashboard } from './utils/server-utils';

export async function createWorkspaceAction(
  prevState: TActionState,
  formData: FormData,
): Promise<TActionState> {
  if (!formData) {
    return initialState;
  }

  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create workspace.',
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not logged in');
  }

  const newId = crypto.randomUUID();
  const { error: workspaceError } = await supabase
    .from('workspace')
    .insert({ id: newId, name: validatedFields.data.name });

  if (workspaceError) {
    throw workspaceError;
  }

  const { error: userWorkspaceError } = await supabase
    .from('user_workspace')
    .insert({ user_id: user.id, workspace_id: newId })
    .select();

  if (userWorkspaceError) {
    await supabase.from('workspace').delete().eq('id', newId);
    throw userWorkspaceError;
  }

  revalidateDashboard();
  return { success: true };
}

export async function createBoardAction(
  workspaceIdParam: string | undefined,
  redirectToNewBoard: boolean,
  prevState: TActionState,
  formData: FormData,
): Promise<TActionState> {
  if (!formData) {
    return initialState;
  }

  const validatedFields = CreateBoardSchema.safeParse({
    name: formData.get('name'),
    workspaceId: workspaceIdParam ?? formData.get('workspace-id'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create board.',
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('board')
    .insert({ name: validatedFields.data.name, workspace_id: validatedFields.data.workspaceId })
    .select()
    .single();

  if (error) {
    throw error;
  }

  revalidateDashboard();

  if (redirectToNewBoard) {
    redirect(`/boards/${data.id}`);
  }

  return { success: true };
}

export async function createListAction({
  boardId,
  name,
  rank,
}: {
  boardId: string;
  name: string;
  rank: string;
}) {
  const validatedFields = CreateListSchema.safeParse({
    boardId,
    name,
    rank,
  });
  if (!validatedFields.success) {
    throw new Error('Missing fields. Failed to create list.');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('board_list')
    .insert({
      name: validatedFields.data.name,
      rank: validatedFields.data.rank,
      board_id: validatedFields.data.boardId,
    })
    .select(
      ` 
      *,
      cards: card(
        *
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function globalSearchAction(term: string) {
  const supabase = await createClient();

  return supabase.rpc('search_workspaces_boards_cards', { search_term: term });
}

export async function updateEntityAction<TableName extends keyof TPublicSchema['Tables']>({
  tableName,
  entityData,
  redirectUrl,
}: {
  tableName: TableName;
  entityData: TablesUpdate<TableName> & { id: string };
  redirectUrl?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(tableName as keyof TPublicSchema['Tables'])
    .update(entityData)
    .eq('id', entityData.id);

  if (error) {
    throw error;
  }

  revalidateDashboard();

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

export async function deleteEntityAction<TableName extends keyof TPublicSchema['Tables']>({
  tableName,
  entityId,
  redirectUrl,
}: {
  tableName: TableName;
  entityId: string;
  redirectUrl?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from(tableName).delete().eq('id', entityId);

  if (error) {
    throw error;
  }

  revalidateDashboard();

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
