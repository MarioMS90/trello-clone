'use client';

import { useState } from 'react';
import Popover from '../ui/popover';
import { CreateBoardForm, CreateWorkspaceForm } from './create-forms';

export function CreateWorkspacePopover() {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  return (
    <div className="inline-block">
      <Popover
        popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
        triggerClassName="
          rounded 
          px-2 
          py-1.5 
          h-20 
          w-44 
          bg-gray-300 
          text-sm 
          text-primary 
          justify-center 
          hover:opacity-90 
          hover:bg-gray-300 
        "
        triggerContent="Create a new workspace"
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        addCloseButton>
        <CreateWorkspaceForm onSubmitSuccess={() => setPopoverOpen(false)} />
      </Popover>
    </div>
  );
}

export function CreateBoardPopover({
  workspaceId,
  triggerClassName,
  buttonText,
}: {
  workspaceId: string;
  triggerClassName?: string;
  buttonText?: React.ReactNode;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="inline-block">
      <Popover
        popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
        triggerClassName={
          triggerClassName ||
          `
            rounded 
            px-2 
            py-1.5 
            h-20 
            w-44 
            bg-gray-300 
            text-sm 
            text-primary 
            justify-center 
            hover:opacity-90 
            hover:bg-gray-300 
          `
        }
        triggerContent={buttonText || 'Create a new board'}
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        addCloseButton>
        <CreateBoardForm workspaceId={workspaceId} onSubmitSuccess={() => setPopoverOpen(false)} />
      </Popover>
    </div>
  );
}
