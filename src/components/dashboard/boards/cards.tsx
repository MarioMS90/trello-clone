'use client';

import { TCardList } from '@/types/app-types';
import { useEffect, useRef, useState } from 'react';
import { CardList } from '@/components/dashboard/boards/card-list';
import invariant from 'tiny-invariant';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';

export function Cards({ initialCardLists }: { initialCardLists: TCardList[] }) {
  const [cardLists, setCardLists] = useState<TCardList[]>(initialCardLists);
  const cardListRef = useRef(null);
  const {
    optimisticList: optimisticCardLists,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(cardLists, {
    updateAction: entityData => updateEntityAction('card_list', entityData),
    deleteAction: entityId => deleteEntityAction('card_list', entityId),
  });

  useEffect(() => {
    const el = cardListRef.current;
    invariant(el);
    console.log('hola', el);
    return draggable({
      element: el,
    });
  }, []);

  useEffect(() => {
    setCardLists(initialCardLists);
  }, [initialCardLists]);

  return (
    <>
      <div className="size-10 bg-red-900"></div>

      {optimisticCardLists.map(cardList => (
        <li className="h-full" key={cardList.id}>
          <CardList
            cardList={cardList}
            onUpdate={cardListData => optimisticUpdate(cardListData)}
            onDelete={cardListData => optimisticDelete(cardListData)}
            ref={cardListRef}
          />
        </li>
      ))}
    </>
  );
}
