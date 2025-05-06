'use client';

import { useCard } from '@/lib/card/queries';
import { useList } from '@/lib/list/queries';
import { useClickAway } from '@uidotdev/usehooks';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';

export default function Card({ cardId }: { cardId: string }) {
  const router = useRouter();
  const { data: card } = useCard(cardId);
  if (!card) {
    notFound();
  }
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
    <div className="scrollbar-stable text-primary fixed top-0 left-0 z-50 h-dvh w-dvw bg-black/75">
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
  );
}
