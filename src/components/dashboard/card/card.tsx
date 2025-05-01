'use client';

import { useCard } from '@/lib/card/queries';
import { useList } from '@/lib/list/queries';
import { useClickAway } from '@uidotdev/usehooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import invariant from 'tiny-invariant';

export default function Card({ cardId }: { cardId: string }) {
  const router = useRouter();
  const { data: card } = useCard(cardId);
  invariant(card);
  const { data: list } = useList(card.listId);

  const clickAwayRef = useClickAway<HTMLDivElement>(event => {
    if (!(event instanceof MouseEvent)) {
      return;
    }

    if (event.button !== 0 && event.button !== 2) {
      return;
    }

    router.push(`/boards/${list.boardId}`);
  });

  return (
    <div className="card-wrapper">
      <div className="scrollbar-stable fixed left-0 top-0 z-50 h-dvh w-dvw bg-black/75 text-primary">
        <div
          className="center-xy fixed w-auto rounded-xl  bg-neutral-200 p-4 md:w-[768px]"
          ref={clickAwayRef}>
          <div>Card ID: {cardId}</div>
          <div>List ID: {list.id}</div>
          <Link href={`/boards/${list.boardId}`} className="">
            Pruebaaaa
          </Link>
        </div>
      </div>
    </div>
  );
}
