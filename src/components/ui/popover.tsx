'use client';

import { useEffect, useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import CloseIcon from '../icons/close';

export default function Popover({
  triggerContent,
  triggerClassName,
  popoverClassName,
  children: popoverContent,
  open = false,
  onOpenChange,
  addCloseButton,
}: {
  triggerContent: React.ReactNode;
  triggerClassName?: string;
  popoverClassName?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  addCloseButton?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(open);
  const clickAwayRef = useClickAway<HTMLDivElement>(() => {
    handleOpenChange(false);
  });

  const handleOpenChange = (state: boolean) => {
    setIsOpen(state);

    if (onOpenChange) {
      onOpenChange(state);
    }
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="popover-wrapper relative" ref={clickAwayRef}>
      <button
        className={`
          flex 
          items-center 
          gap-2 
          rounded
          px-3 
          py-1.5 
          hover:bg-button-hovered-background 
          ${triggerClassName}
        `}
        type="button"
        onClick={() => handleOpenChange(!isOpen)}>
        {triggerContent}
      </button>
      {isOpen && (
        <dialog
          className={` 
            popover
            absolute
            left-0 
            top-[calc(100%+5px)]
            z-10 
            flex 
            w-72 
            flex-col 
            rounded-lg 
            bg-white 
            p-3 
            text-primary
            shadow-lg
            outline-none
            ${popoverClassName}
          `}>
          {addCloseButton && (
            <button
              className="
                close-popover 
                absolute 
                right-2 
                top-2 
                flex 
                size-7 
                items-center 
                justify-center 
                rounded-md 
                hover:bg-gray-300
              "
              type="button"
              onClick={() => handleOpenChange(false)}>
              <span className="pointer-events-none">
                <CloseIcon height={16} />
              </span>
            </button>
          )}
          {popoverContent}
        </dialog>
      )}
    </div>
  );
}
