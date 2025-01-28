'use client';

import { useRef, useState } from 'react';
import CloseIcon from '@/components/icons/close';
import invariant from 'tiny-invariant';
import PlusIcon from '@/components/icons/plus';
import { useClickAway } from '@uidotdev/usehooks';
import { resizeTextarea } from '@/lib/utils/utils';
import { useBoardContext } from '../board/board-context';

export function CreateList({ buttonText }: { buttonText: string }) {
  const [creatingList, setCreatingList] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addList } = useBoardContext();
  const clickAwayRef = useClickAway<HTMLDivElement>(() => {
    setCreatingList(false);
  });

  const handleSubmit = () => {
    const textarea = textareaRef.current;
    invariant(textarea);
    const name = textarea.value.trim();

    if (!name) {
      return;
    }

    addList(name);
    textarea.value = '';
    textarea.focus();
  };

  return (
    <>
      {creatingList ? (
        <div
          className="flex h-max w-[272px] flex-shrink-0 flex-col gap-2 rounded-xl bg-gray-200 p-2 text-sm text-primary"
          ref={clickAwayRef}>
          <textarea
            className="shadow-transition focus:shadow-transition-effect resize-none overflow-hidden rounded-md bg-white px-2.5 py-1.5 font-semibold outline-none"
            onChange={() => resizeTextarea(textareaRef)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setCreatingList(false);
              }
            }}
            ref={textareaRef}
            autoFocus
            rows={1}
          />
          <div className="flex gap-2">
            <button
              className="
                rounded 
                bg-secondary 
                px-3 
                py-1.5 
                text-sm 
                font-medium 
                text-white 
                disabled:cursor-not-allowed 
                disabled:bg-gray-200 
                disabled:text-gray-400
              "
              type="button"
              onClick={handleSubmit}>
              Add list
            </button>
            <button
              className="h-full rounded p-1.5 hover:bg-gray-300"
              type="button"
              onClick={() => {
                setCreatingList(false);
              }}>
              <span className="pointer-events-none">
                <CloseIcon height={20} />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <li>
          <button
            type="button"
            className="
              flex 
              w-[272px] 
              items-center 
              gap-2 
              rounded-xl 
              bg-white 
              bg-opacity-10 
              p-3 
              text-sm 
              text-primary 
              text-white 
              shadow 
              hover:bg-opacity-15
            "
            onClick={() => setCreatingList(true)}>
            <PlusIcon width={16} height={16} />
            {buttonText}
          </button>
        </li>
      )}
    </>
  );
}
