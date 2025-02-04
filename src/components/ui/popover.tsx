'use client';

import { useEffect, useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { cn } from '@/lib/utils/utils';
import CloseIcon from '../icons/close';

export default function Popover({
  triggerContent,
  triggerClassName,
  popoverClassName,
  children: popoverContent,
  addCloseButton,
  open = false,
  onOpenChange,
}: {
  triggerContent: React.ReactNode;
  triggerClassName?: string;
  popoverClassName?: string;
  children: React.ReactNode;
  addCloseButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(open);
  const clickAwayRef = useClickAway<HTMLDivElement>(() => {
    if (!isOpen) {
      return;
    }

    handleOpenChange(false);
  });

  const handleOpenChange = (openState: boolean) => {
    setIsOpen(openState);

    if (onOpenChange) {
      onOpenChange(openState);
    }
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="popover-wrapper relative" ref={clickAwayRef}>
      <button
        className={cn(
          'flex items-center gap-2 rounded px-3 py-1.5 hover:bg-button-hovered-background',
          triggerClassName,
        )}
        type="button"
        onClick={() => handleOpenChange(!isOpen)}>
        {triggerContent}
      </button>
      {isOpen && (
        <dialog
          className={cn(
            'popover absolute left-0 top-[calc(100%+5px)] z-20 flex w-72 flex-col rounded-lg bg-white p-3 text-primary shadow-lg outline-none',
            popoverClassName,
          )}>
          {addCloseButton && (
            <button
              className="close-popover absolute right-2 top-2 flex size-7 items-center justify-center rounded-md hover:bg-gray-300"
              type="button"
              onMouseUp={() => handleOpenChange(false)}>
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
