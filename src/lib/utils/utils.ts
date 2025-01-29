import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';
import { TSubsetWithId } from '@/types/types';
import { RefObject } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRank<T extends { rank: string }>({
  list,
  leftIndex,
}: {
  list: T[];
  leftIndex: number;
}) {
  if (!list.length) {
    return LexoRank.middle();
  }

  if (leftIndex === -1) {
    return LexoRank.parse(list[0].rank).genPrev();
  }

  if (leftIndex === list.length - 1) {
    return LexoRank.parse(list[leftIndex].rank).genNext();
  }

  const leftRank = LexoRank.parse(list[leftIndex].rank);
  const rightRank = LexoRank.parse(list[leftIndex + 1].rank);
  return leftRank.between(rightRank);
}

export function updateListObj<T extends { id: string }, U extends TSubsetWithId<T>>(
  list: T[],
  obj: U,
): T[] {
  return list.map(item => (item.id === obj.id ? { ...item, ...obj } : item));
}

export function resizeTextarea(textareaRef: RefObject<HTMLTextAreaElement | null>) {
  const textarea = textareaRef.current;
  if (!textarea) {
    return;
  }

  textarea.style.height = '0px';
  const { scrollHeight } = textarea;
  textarea.style.height = `${scrollHeight}px`;
}
