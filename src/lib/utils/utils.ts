import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';
import { RefObject } from 'react';
import { CamelCasedProperties } from 'type-fest';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRank<T extends { rank: string }>(elements: T[], leftIndex: number) {
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

export function resizeTextarea(textareaRef: RefObject<HTMLTextAreaElement | null>) {
  const textarea = textareaRef.current;
  if (!textarea) {
    return;
  }

  textarea.style.height = '0px';
  const { scrollHeight } = textarea;
  textarea.style.height = `${scrollHeight}px`;
}

export function camelize(str: string, separator = '_') {
  const words = str.split(separator);

  return words.reduce((_str, word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }

    return _str + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }, '');
}

export function camelizeKeys<
  T extends Record<string, unknown | null>,
  U extends CamelCasedProperties<T>,
>(obj: T): U {
  return Object.keys(obj).reduce<U>((_obj, key) => {
    const camelizedKey = camelize(key);

    return { ..._obj, [camelizedKey]: obj[key] };
  }, {} as U);
}
