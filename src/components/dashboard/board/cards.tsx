'use client';

import { CardList as CardListType } from '@/types/app-types';
import { CardList } from '@/components/dashboard/board/card-list';
import { useEffect, useState } from 'react';

export function Cards({ initialCardLists }: { initialCardLists: CardListType[] }) {
  const [cardLists, setCardLists] = useState<CardListType[]>(initialCardLists);

  useEffect(() => {
    setCardLists(initialCardLists);
  }, [initialCardLists]);

  return (
    <>
      {cardLists.map(({ id, name, cards }) => (
        <li className="h-full" key={id}>
          <CardList listName={name} cards={cards} />
        </li>
      ))}
    </>
  );
}
