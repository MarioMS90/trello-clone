import { QueryClient } from '@tanstack/react-query';
import { TWorkspace } from '@/types/db';
import Strategy from './strategy';

export default class WorkspaceStrategy implements Strategy {
  queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  handleInsert(workspace: TWorkspace) {}

  handleUpdate(workspace: TWorkspace) {}

  handleDelete(workspaceId: string) {}
}
