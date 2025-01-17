import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRank<T extends { rank: string }>(list: T[], destinationIndex: number) {
  if (destinationIndex === 0) {
    return LexoRank.parse(list[destinationIndex + 1].rank).genPrev();
  }

  if (destinationIndex === list.length - 1) {
    return LexoRank.parse(list[destinationIndex - 1].rank).genNext();
  }

  const leftRank = LexoRank.parse(list[destinationIndex - 1].rank);
  const rightRank = LexoRank.parse(list[destinationIndex + 1].rank);
  return leftRank.between(rightRank);
}
