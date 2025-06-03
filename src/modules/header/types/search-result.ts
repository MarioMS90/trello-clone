type CardSearchResult = {
  kind: 'card';
  id: string;
  name: string;
  workspace: string;
  board: string;
  list: string;
};

type BoardSearchResult = {
  kind: 'board';
  id: string;
  name: string;
  workspace: string;
};

type WorkspaceSearchResult = {
  kind: 'workspace';
  id: string;
  name: string;
};

export type SearchResult = CardSearchResult | BoardSearchResult | WorkspaceSearchResult;
