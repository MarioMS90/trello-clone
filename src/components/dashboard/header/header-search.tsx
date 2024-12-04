'use client';

import SearchIcon from '@/components/icons/search';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function HeaderSearch({ placeholder }: { placeholder: string }) {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearch = useDebouncedCallback(term => {
    console.log(`Searching... ${term}`);
  }, 300);

  return (
    <div className={`relative h-7 ${isInputFocused ? 'w-2/4' : 'w-72'}`}>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
        <SearchIcon height={17} />
      </span>
      <input
        className={`
          size-full 
          rounded 
          border 
          border-gray-400 
          bg-white 
          bg-opacity-20 
          pl-8 
          text-sm 
          text-white 
          placeholder-white 
          outline-none 
          hover:bg-opacity-30 
          ${isInputFocused ? 'search-box-shadow' : ''}
        `}
        type="text"
        placeholder={placeholder}
        onChange={e => {
          handleSearch(e.target.value);
        }}
        onBlur={() => setIsInputFocused(false)}
        onFocus={() => setIsInputFocused(true)}></input>
      {isInputFocused && (
        <div className="column absolute inset-x-0 top-[calc(100%+10px)] flex w-full rounded bg-white px-4 py-2 text-primary shadow-md">
          Hola
        </div>
      )}
    </div>
  );
}
