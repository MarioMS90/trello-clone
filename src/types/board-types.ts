export type TListData = {
  type: 'list';
  id: string;
  rect: DOMRect;
};

export type TCardData = {
  type: 'card';
  id: string;
  listId: string;
  rect: DOMRect;
};

export function isListData(value: Record<string, unknown>): value is TListData {
  return value && value.type === 'list';
}

export function isCardData(value: Record<string, unknown>): value is TCardData {
  return value && value.type === 'card';
}
