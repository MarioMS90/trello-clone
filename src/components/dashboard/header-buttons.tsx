'use client';

import { useState } from 'react';
import Popover from '../ui/popover';
import ArrowDownIcon from '../icons/arrow-down';

export function HeaderButtons() {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const buttons = [
    {
      id: 'workspaces',
      text: (
        <>
          Workspaces
          <ArrowDownIcon height="16px" />
        </>
      ),
      popoverContent: 'Hola',
    },
    {
      id: 'marked',
      text: (
        <>
          Marked
          <ArrowDownIcon height="16px" />
        </>
      ),
      popoverContent: 'Hola',
    },
    {
      id: 'create-board',
      text: 'Create board',
      popoverContent: 'Hola',
      triggerClassName: `ml-3 bg-white bg-opacity-20 px-3 py-1.5 text-white hover:bg-opacity-30`,
    },
  ];

  return (
    <>
      {buttons.map(({ id, text, popoverContent, triggerClassName }) => (
        <Popover
          key={id}
          triggerClassName={triggerClassName}
          text={text}
          open={selectedButton === id}
          onOpenChange={isOpen => isOpen && setSelectedButton(id)}>
          {popoverContent}
        </Popover>
      ))}
    </>
  );
}
