'use client';

import { useEffect, useState } from 'react';
import CloseIcon from '../icons/close';

export default function Popover({
  text,
  children: popoverContent,
  open,
  onOpenChange,
}: {
  text: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closePopover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target ||
        (!target.closest('.popover-wrapper') && !target.classList.contains('close-popover'))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', closePopover);

    return () => {
      document.removeEventListener('click', closePopover);
    };
  }, [isOpen]);

  useEffect(() => {
    if (open === undefined) {
      return;
    }

    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (!onOpenChange) {
      return;
    }

    onOpenChange(isOpen);
  }, [onOpenChange, isOpen]);

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
        onClick={() => setIsOpen(prevState => !prevState)}>
        {text}
      </button>
      {isOpen && (
        <div className="center-y absolute left-[calc(100%+10px)] flex w-80 flex-col rounded-lg bg-white p-4 text-primary">
          <button
            className="close-popover absolute right-2 top-2 flex size-7 items-center justify-center rounded-md hover:bg-gray-300"
            type="button"
            onClick={event => {
              event.stopPropagation(); // Detiene la propagación del evento
              setIsOpen(false);
            }}>
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
