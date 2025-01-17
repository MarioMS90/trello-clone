export type TCardSearchResult = {
  kind: 'card';
  id: string;
  name: string;
  workspace: string;
  board: string;
  list: string;
};

export type TBoardSearchResult = {
  kind: 'board';
  id: string;
  name: string;
  workspace: string;
};

export type TWorkspaceSearchResult = {
  kind: 'workspace';
  id: string;
  name: string;
};

export type TSearchResult = TCardSearchResult | TBoardSearchResult | TWorkspaceSearchResult;

export type TSearchResults = TSearchResult[];
