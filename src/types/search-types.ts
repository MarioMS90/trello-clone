export type TaskSearchResult = {
  kind: 'task';
  id: string;
  name: string;
  workspace: string;
  board: string;
  task_list: string;
};

export type BoardSearchResult = {
  kind: 'board';
  id: string;
  name: string;
  workspace: string;
};

export type WorkspaceSearchResult = {
  kind: 'workspace';
  id: string;
  name: string;
};

export type SearchResult = TaskSearchResult | BoardSearchResult | WorkspaceSearchResult;

export type SearchResults = SearchResult[];
