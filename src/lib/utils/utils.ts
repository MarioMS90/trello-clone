import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';
import { TSubsetWithId } from '@/types/types';
import { RefObject } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateElementRank<T extends { rank: string }>({
  list,
  elementIndex,
}: {
  list: T[];
  elementIndex: number;
}) {
  if (elementIndex === 0) {
    return LexoRank.parse(list[elementIndex + 1].rank).genPrev();
  }

  if (elementIndex === list.length - 1) {
    return LexoRank.parse(list[elementIndex - 1].rank).genNext();
  }

  const leftRank = LexoRank.parse(list[elementIndex - 1].rank);
  const rightRank = LexoRank.parse(list[elementIndex + 1].rank);
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
