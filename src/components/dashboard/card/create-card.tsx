'use client';

import { useRef } from 'react';
import CloseIcon from '@/components/icons/close';
import invariant from 'tiny-invariant';
import { resizeTextarea } from '@/lib/utils/utils';

export function CreateCard({
  onCardCreated,
  onCancel,
  ref,
}: {
  onCardCreated: (name: string) => void;
  onCancel: () => void;
  ref: React.RefObject<HTMLLIElement>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCardCreated = () => {
    const textarea = textareaRef.current;
    invariant(textarea);
    const name = textarea.value.trim();

    if (!name) {
      onCancel();
      return;
    }

    onCardCreated(name);
    textarea.value = '';
    textarea.focus();
  };

  return (
    <li className="flex flex-shrink-0 flex-col gap-2 px-2 pt-1 text-sm text-primary" ref={ref}>
      <textarea
        className="card-shadow focus:shadow-transition focus:shadow-transition-effect min-h-14 resize-none overflow-hidden rounded-lg bg-white p-3 py-2 placeholder-gray-500 outline-none"
        placeholder="Enter a title for this card"
        onChange={() => resizeTextarea(textareaRef)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleCardCreated();
          }
        }}
        onKeyUp={e => {
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
        ref={textareaRef}
        autoFocus
        rows={1}
      />
      <div className="mt-1 flex gap-2">
        <button
          className="
              rounded 
              bg-secondary 
              px-3 
              py-1.5 
              text-sm 
              font-medium 
              text-white
              hover:opacity-80 
              disabled:cursor-not-allowed 
              disabled:bg-gray-200 
              disabled:text-gray-400
            "
          type="button"
          onClick={handleCardCreated}>
          Add card
        </button>
        <button className="h-full rounded p-1.5 hover:bg-gray-300" type="button" onClick={onCancel}>
          <span className="pointer-events-none">
            <CloseIcon height={20} />
          </span>
        </button>
      </div>
    </li>
  );
}
