'use client';

import { useCallback, useEffect, useState } from 'react';
import CloseIcon from '../icons/close';

export default function Popover({
  buttonText,
  triggerClassName,
  popoverClassName,
  children: popoverContent,
  open = false,
  onOpenChange,
  addCloseButton,
}: {
  buttonText: React.ReactNode;
  triggerClassName?: string;
  popoverClassName?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  addCloseButton?: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(open);

  const handleOpenChange = useCallback(
    (state: boolean) => {
      setIsOpen(state);

      if (onOpenChange) {
        onOpenChange(state);
      }
    },
    [onOpenChange],
  );

  useEffect(() => {
    const closePopover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target ||
        (!target.closest('.popover-wrapper') && !target.classList.contains('close-popover'))
      ) {
        handleOpenChange(false);
      }
    };

    document.addEventListener('click', closePopover);

    return () => {
      document.removeEventListener('click', closePopover);
    };
  }, [handleOpenChange]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="popover-wrapper relative">
      <button
        className={`
          flex 
          cursor-pointer 
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
        {buttonText}
      </button>
      {isOpen && (
        <div
          className={` 
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
                <CloseIcon height="16px" />
              </span>
            </button>
          )}
          {popoverContent}
        </div>
      )}
    </div>
  );
}
