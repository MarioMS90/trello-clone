'use client';

import { useState } from 'react';

export default function Popover({
  text,
  children: popoverContent,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
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
      {isPopoverOpen && <div>{popoverContent}</div>}
    </>
  );
}
