import Popover from '../ui/popover';
import { CreateBoardForm, CreateWorkspaceForm } from './create-forms';

export function CreateWorkspacePopover() {
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
        addCloseButton>
        <CreateWorkspaceForm />
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
        addCloseButton>
        <CreateBoardForm workspaceId={workspaceId} />
      </Popover>
    </div>
  );
}
