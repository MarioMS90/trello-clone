'use client';

import { useList } from '@/lib/list/queries';
import { TCard } from '@/types/db';
import invariant from 'tiny-invariant';

export default function ListSelector({ card }: { card: TCard }) {
  const { data: list } = useList(card.listId);
  invariant(list);

  return <span className="text-sm">in list {list.name}</span>;
}
