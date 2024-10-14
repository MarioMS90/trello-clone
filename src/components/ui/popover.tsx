'use client';

import { useEffect, useRef, useState } from 'react';
import CloseIcon from '../icons/close';

export default function Popover({
  text,
  children: popoverContent,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const closePopover = (event: MouseEvent) => {
      console.log('test1 event.target.closest', event.target);
      if (!event.target || !(event.target as HTMLElement).closest('.popover-wrapper')) {
        console.log('test2 event.target.closest', event.target.closest('.popover-wrapper'));
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('click', closePopover);

    return () => {
      document.removeEventListener('click', closePopover);
    };
  }, []);

  return (
    <div className="popover-wrapper relative inline-block">
      <button
        className={`
          flex 
          h-20 
          w-44 
          items-center 
          justify-center 
          rounded 
          bg-gray-300 
          text-sm 
          text-primary 
          hover:opacity-90
        `}
        type="button"
        onClick={() => setIsPopoverOpen(prevState => !prevState)}>
        {text}
      </button>
      {isPopoverOpen && (
        <div className="center-y absolute left-[calc(100%+10px)] flex w-80 flex-col rounded-lg bg-white px-4 py-6 text-primary">
          <button
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md hover:bg-gray-300"
            type="button"
            onClick={() => setIsPopoverOpen(false)}>
            <span className="pointer-events-none">
              <CloseIcon height="16px" />
            </span>
          </button>
          {popoverContent}
        </div>
      )}
    </div>
  );
}
