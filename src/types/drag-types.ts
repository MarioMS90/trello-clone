export type TColumnData = {
  kind: 'column';
  id: string;
};

export type TCardData = {
  kind: 'card';
  id: string;
  columnId: string;
};

export type DragTypeData = TColumnData | TCardData;

export function isColumnData(value: Record<string, unknown>): value is TColumnData {
  return value && value.kind === 'column';
}

export function isCardData(value: DragTypeData): value is TCardData {
  return value && value.kind === 'card';
}
