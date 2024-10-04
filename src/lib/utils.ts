import { UserWorkspace } from '@/types/app-types';

export function getWorkspaceIdFromBoard(
  workspaces: UserWorkspace[],
  boardId: string,
): string | undefined {
  const boards = workspaces.flatMap(workspace => workspace.boards);
  const board = boards.find(_board => _board.id === boardId);

  return board?.workspace_id;
}
