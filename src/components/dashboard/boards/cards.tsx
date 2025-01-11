'use client';

import { TCardList } from '@/types/app-types';
import { useEffect, useState } from 'react';
import { CardList } from '@/components/dashboard/boards/card-list';

import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';

export function Cards({ initialCardLists }: { initialCardLists: TCardList[] }) {
  const [cardLists, setCardLists] = useState<TCardList[]>(initialCardLists);

  const {
    optimisticList: optimisticCardLists,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(cardLists, {
    updateAction: entityData => updateEntityAction('card_list', entityData),
    deleteAction: entityId => deleteEntityAction('card_list', entityId),
  });

  useEffect(() => {
    setCardLists(initialCardLists);
  }, [initialCardLists]);

  return (
    <>
      {optimisticCardLists.map(cardList => (
        <li className="h-full" key={cardList.id}>
          <CardList
            cardList={cardList}
            onUpdate={cardListData => optimisticUpdate(cardListData)}
            onDelete={cardListData => optimisticDelete(cardListData)}
          />
        </li>
      ))}
    </>
  );
}
