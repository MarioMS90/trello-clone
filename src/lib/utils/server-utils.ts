'use server';

import { TWorkspace } from '@/types/db';
import { fetchWorkspaces } from '../workspace/queries';

export async function getWorkspace(
  workspaceId: string | undefined,
): Promise<TWorkspace | undefined> {
  const workspaces = await fetchWorkspaces();

  const workspace = workspaces.find(_workspace => _workspace.id === workspaceId);

  return workspace;
}

export async function getWorkspaceIdFromBoard(boardId: string): Promise<string | undefined> {
  const workspaces = await fetchWorkspaces();

  const boards = workspaces.flatMap(workspace => workspace.boards);
  const board = boards.find(_board => _board.id === boardId);

  return board?.workspace_id;
}

export async function getStarredBoards(workspaces: TWorkspace[]) {
  return workspaces.flatMap(workspace =>
    workspace.boards
      .filter(board => board.starred)
      .map(board => ({ ...board, workspaceName: workspace.name })),
  );
}
