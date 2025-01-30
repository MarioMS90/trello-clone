import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';
import { TSubsetWithId } from '@/types/types';
import { RefObject } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRank<T extends { rank: string }>({
  elements,
  leftIndex,
}: {
  elements: T[];
  leftIndex: number;
}) {
  if (!elements.length) {
    return LexoRank.middle();
  }

  if (leftIndex === -1) {
    return LexoRank.parse(elements[0].rank).genPrev();
  }

  if (leftIndex === elements.length - 1) {
    return LexoRank.parse(elements[leftIndex].rank).genNext();
  }

  const leftRank = LexoRank.parse(elements[leftIndex].rank);
  const rightRank = LexoRank.parse(elements[leftIndex + 1].rank);
  return leftRank.between(rightRank);
}

export function updateElement<T extends { id: string }, U extends TSubsetWithId<T>>(
  elements: T[],
  obj: U,
): T[] {
  return elements.map(element => (element.id === obj.id ? { ...element, ...obj } : element));
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
