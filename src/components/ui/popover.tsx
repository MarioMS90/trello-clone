'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/utils';
import {
  useFloating,
  autoUpdate,
  useClick,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  useDismiss,
} from '@floating-ui/react';

export default function Popover({
  triggerContent,
  triggerClassName,
  popoverClassName,
  children: popoverContent,
  open = false,
  onOpenChange,
}: {
  triggerContent: React.ReactNode;
  triggerClassName?: string;
  popoverClassName?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(open);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (openState: boolean) => {
      setIsOpen(openState);

      if (onOpenChange) {
        onOpenChange(openState);
      }
    },
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="popover-wrapper">
      <button
        {...getReferenceProps()}
        className={cn(
          'hover:bg-button-hovered-background flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5',
          triggerClassName,
        )}
        type="button"
        ref={refs.setReference}>
        {triggerContent}
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className={cn(
                'popover text-primary z-20 flex w-72 flex-col rounded-lg bg-white p-3 shadow-lg outline-hidden',
                popoverClassName,
              )}
              style={floatingStyles}
              {...getFloatingProps()}
              ref={refs.setFloating}>
              {popoverContent}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
