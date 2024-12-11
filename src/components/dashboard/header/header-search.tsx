'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import BoardsIcon from '@/components/icons/boards';
import CardIcon from '@/components/icons/card';
import Loading from '@/components/ui/loading';
import NoSearchResultsIcon from '@/components/icons/no-search-results';
import SearchIcon from '@/components/icons/search';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import { globalSearchAction } from '@/lib/actions';
import { SearchResult, SearchResults } from '@/types/search-types';

export default function HeaderSearch({ placeholder }: { placeholder: string }) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    setSearchResults(null);
    inputRef.current.value = '';
  }, [pathname]);

  const handleSearch = (term: string) => {
    if (term === '') {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    doSearch(term);
  };

  const doSearch = useDebouncedCallback(async term => {
    const results = await globalSearchAction(term);
    setSearchResults(results);
    setIsLoading(false);
  }, 300);

  return (
    <div className={`relative h-7 ${isInputFocused || searchResults ? 'w-2/4' : 'w-72'}`}>
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
          ${isInputFocused || searchResults ? 'search-box-shadow' : ''}
        `}
        type="text"
        placeholder={placeholder}
        onChange={e => {
          handleSearch(e.target.value);
        }}
        onBlur={() => setIsInputFocused(false)}
        onFocus={() => setIsInputFocused(true)}
        ref={inputRef}></input>
      {(searchResults || isLoading) && (
        <div
          className="
            column 
            absolute
            inset-x-0
            top-[calc(100%+10px)] 
            z-10 
            flex 
            min-h-24 
            flex-col 
            rounded 
            bg-white 
            pb-3 
            pt-2
            text-primary
            shadow-xl
          ">
          {isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <Loading />
            </div>
          )}
          {searchResults && !isLoading && <SearchResultsContent searchResults={searchResults} />}
        </div>
      )}
    </div>
  );
}

function SearchResultsContent({ searchResults }: { searchResults: SearchResults }) {
  if (searchResults.length === 0) {
    return (
      <div className="flex w-full flex-col items-center text-center">
        <NoSearchResultsIcon width={124} height={124} />
        <p className="pb-1 font-medium">We couldn&apos;t find anything matching your search.</p>
        <p className="pb-2">Try again with a different term</p>
      </div>
    );
  }

  const generateSearchResults = (kind: SearchResult['kind']): JSX.Element | null => {
    const resultsToRender = searchResults.filter(result => result.kind === kind);
    if (resultsToRender.length === 0) {
      return null;
    }

    return (
      <ul>
        {resultsToRender.map(searchResult => (
          <li key={searchResult.id}>{generateSearchResult(searchResult)}</li>
        ))}
      </ul>
    );
  };

  const resultSections: {
    title: string;
    content: JSX.Element | null;
  }[] = [
    { title: 'Cards', content: generateSearchResults('task') },
    { title: 'Boards', content: generateSearchResults('board') },
    { title: 'Workspace', content: generateSearchResults('workspace') },
  ];

  return (
    <ul>
      {resultSections.map(
        ({ title, content }) =>
          content && (
            <li className="mb-4" key={title}>
              <h2 className="mb-1 px-4 text-[11px] font-semibold uppercase text-gray-500">
                {title}
              </h2>
              {content}
            </li>
          ),
      )}
    </ul>
  );
}

const generateSearchResult = <T extends SearchResult['kind']>(
  searchResult: Extract<SearchResult, { kind: T }>,
): JSX.Element => {
  const searchResultRenderers: {
    [K in SearchResult['kind']]: (elem: Extract<SearchResult, { kind: K }>) => JSX.Element;
  } = {
    task: ({ id, name, board, task_list }) => (
      <Link className="block hover:bg-gray-200" href={`/cards/${id}`}>
        <div className="flex items-center gap-2 px-4 py-1">
          <CardIcon height={19} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
            <p className="text-[11px] text-gray-500">
              {board}: {task_list}
            </p>
          </div>
        </div>
      </Link>
    ),
    board: ({ id, name, workspace }) => (
      <Link className="block hover:bg-gray-200" href={`/boards/${id}`}>
        <div className="flex items-center gap-2 px-4 py-1">
          <BoardsIcon height={24} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
            <p className="text-[11px] text-gray-500">{workspace}</p>
          </div>
        </div>
      </Link>
    ),
    workspace: ({ id, name }) => (
      <Link className="block hover:bg-gray-200" href={`/workspaces/${id}`}>
        <div className="flex items-center gap-2 px-4 py-1.5">
          <WorkspaceLogo className="[&]:size-6 [&]:text-sm" workspaceName={name} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
          </div>
        </div>
      </Link>
    ),
  };

  return searchResultRenderers[searchResult.kind](searchResult);
};
