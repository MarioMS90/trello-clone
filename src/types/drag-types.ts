export type TColumnData = {
  type: 'column';
  id: string;
};

export type TCardData = {
  type: 'card';
  id: string;
  columnId: string;
};

export function isColumnData(value: Record<string, unknown>): value is TColumnData {
  return value && value.type === 'column';
}

export function isCardData(value: Record<string, unknown>): value is TCardData {
  return value && value.type === 'card';
}
