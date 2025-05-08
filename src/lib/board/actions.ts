'use server';

import { TBoard, TMutation, TMutationDelete, TStarredBoard } from '@/types/db';
import { CreateBoardSchema, UpdateBoardSchema } from '@/schemas/workspace-schemas';
import { TablesInsert, TablesUpdate } from '@/types/database-types';
import invariant from 'tiny-invariant';
import { deleteEntity, insertEntity, updateEntity } from '../supabase/server-utils';
import { createClient } from '../supabase/server';

export async function createBoard(boardData: TablesInsert<'boards'>): Promise<TMutation<TBoard>> {
  const validatedFields = CreateBoardSchema.safeParse({
    name: boardData.name,
    workspaceId: boardData.workspace_id,
  });
  if (!validatedFields.success) {
    throw new Error('Missing fields. Failed to create board.');
  }

  const board = await insertEntity({
    tableName: 'boards',
    entityData: {
      name: validatedFields.data.name,
      workspace_id: validatedFields.data.workspaceId,
    },
  });

  return { data: board };
}

export async function updateBoard(
  boardData: TablesUpdate<'boards'> & { id: string },
): Promise<TMutation<TBoard>> {
  const validatedFields = UpdateBoardSchema.safeParse(boardData);
  if (!validatedFields.success) {
    throw new Error('Invalid board data');
  }

  const board = await updateEntity({ tableName: 'boards', entityData: boardData });

  return { data: board };
}

export async function deleteBoard(boardId: string): Promise<TMutationDelete> {
  const id = await deleteEntity({ tableName: 'boards', entityId: boardId });

  return { data: { id } };
}

export async function createStarredBoard(boardId: string): Promise<TMutation<TStarredBoard>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  invariant(user);

  const starredBoard = await insertEntity({
    tableName: 'starred_boards',
    entityData: { user_id: user.id, board_id: boardId },
  });

  return { data: starredBoard };
}

export async function deleteStarredBoard(starredBoardId: string): Promise<TMutationDelete> {
  const id = await deleteEntity({ tableName: 'starred_boards', entityId: starredBoardId });

  return { data: { id } };
}
