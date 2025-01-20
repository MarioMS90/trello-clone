import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';
import { TSubsetWithId } from '@/types/types';
import { RefObject } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRank<T extends { rank: string }>(list: T[], index: number) {
  if (index === 0) {
    return LexoRank.parse(list[index + 1].rank).genPrev();
  }

  if (index === list.length - 1) {
    return LexoRank.parse(list[index - 1].rank).genNext();
  }

  const leftRank = LexoRank.parse(list[index - 1].rank);
  const rightRank = LexoRank.parse(list[index + 1].rank);
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
