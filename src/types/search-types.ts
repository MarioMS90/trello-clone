export type CardSearchResult = {
  kind: 'card';
  id: string;
  name: string;
  workspace: string;
  board: string;
  card_list: string;
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

export type SearchResult = CardSearchResult | BoardSearchResult | WorkspaceSearchResult;

export type SearchResults = SearchResult[];
