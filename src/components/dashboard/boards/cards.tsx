'use client';

import { CardList as CardListType } from '@/types/app-types';
import { useEffect, useState } from 'react';
import { CardList } from '@/components/dashboard/boards/card-list';

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
