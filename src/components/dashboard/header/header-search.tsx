'use client';

import NoSearchResultsIcon from '@/components/icons/no-search-results';
import SearchIcon from '@/components/icons/search';
import { globalSearchAction } from '@/lib/actions';
import { SearchResults } from '@/types/app-types';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function HeaderSearch({ placeholder }: { placeholder: string }) {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  const handleSearch = useDebouncedCallback(async term => {
    const results = await globalSearchAction(term);
    setSearchResults(results);
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
        <div
          className="
            column 
            absolute 
            inset-x-0 
            top-[calc(100%+10px)] 
            flex 
            w-full
            flex-col 
            rounded 
            bg-white 
            px-4 
            pb-3 
            pt-2 
            text-primary 
            shadow-xl
          ">
          {searchResults?.map(result => (
            <div key={result.id} className="flex gap-2">
              <span>{result.name}</span>
              <span>{result.type}</span>
            </div>
          ))}

          {searchResults?.length === 0 && (
            <div className="flex w-full flex-col items-center text-center">
              <NoSearchResultsIcon width={124} height={124} />
              <p className="pb-1 font-medium">
                We couldn&apos;t find anything matching your search.
              </p>
              <p className="pb-2">Try again with a different term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
