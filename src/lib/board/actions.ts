'use server';

import { TMutationInsert, TMutationUpdate, TMutationDelete } from '@/types/db';
import { CreateBoardSchema, UpdateBoardSchema } from '@/schemas/workspace-schemas';
import { TablesInsert, TablesUpdate } from '@/types/database-types';
import { redirect } from 'next/navigation';
import { deleteEntity, getAuthUser, insertEntity, updateEntity } from '../supabase/utils';

export async function createBoard(
  boardData: TablesInsert<'boards'>,
  redirectToNewBoard: boolean,
): Promise<TMutationInsert> {
  const validatedFields = CreateBoardSchema.safeParse({
    name: boardData.name,
    workspaceId: boardData.workspace_id,
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create board.',
    };
  }

  const id = await insertEntity({
    tableName: 'boards',
    entityData: {
      name: validatedFields.data.name,
      workspace_id: validatedFields.data.workspaceId,
    },
  });

  if (redirectToNewBoard) {
    redirect(`/boards/${id}`);
  }

  return { data: { id } };
}

export async function updateBoard(
  boardData: TablesUpdate<'boards'> & { id: string },
): Promise<TMutationUpdate> {
  const validatedFields = UpdateBoardSchema.safeParse(boardData);
  if (!validatedFields.success) {
    throw new Error('Invalid board data');
  }

  const updatedAt = await updateEntity({ tableName: 'boards', entityData: boardData });

  return { data: { id: boardData.id, updatedAt } };
}

export async function deleteBoard(boardId: string, redirectUrl?: string): Promise<TMutationDelete> {
  await deleteEntity({ tableName: 'boards', entityId: boardId });

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { data: { id: boardId } };
}

export async function createStarredBoard(boardId: string): Promise<TMutationInsert> {
  const user = await getAuthUser();

  const id = await insertEntity({
    tableName: 'starred_boards',
    entityData: { user_id: user.id, board_id: boardId },
  });

  return { data: { id } };
}

export async function deleteStarredBoard(starredBoardId: string): Promise<TMutationDelete> {
  await deleteEntity({ tableName: 'starred_boards', entityId: starredBoardId });

  return { data: { id: starredBoardId } };
}
