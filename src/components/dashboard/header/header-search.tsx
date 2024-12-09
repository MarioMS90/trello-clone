'use client';

import BoardsIcon from '@/components/icons/boards';
import CardIcon from '@/components/icons/card';
import NoSearchResultsIcon from '@/components/icons/no-search-results';
import SearchIcon from '@/components/icons/search';
import WorkspaceLogo from '@/components/ui/workspace-logo';
import { globalSearchAction } from '@/lib/actions';
import { SearchResult, SearchResults } from '@/types/search-types';
import Link from 'next/link';
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
      {searchResults && (
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
            pb-3 
            pt-2 
            text-primary 
            shadow-xl
          ">
          <SearchResultsContent searchResults={searchResults} />
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

  const getFilteredSearchResults = (kind: SearchResult['kind']): JSX.Element | null => {
    const resultsToRender = searchResults.filter(result => result.kind === kind);
    if (resultsToRender.length === 0) {
      return null;
    }

    return (
      <ul>
        {resultsToRender.map(searchResult => (
          <li key={searchResult.id}>{getSearchContent(searchResult)}</li>
        ))}
      </ul>
    );
  };

  const resultSections: {
    title: string;
    content: JSX.Element | null;
  }[] = [
    { title: 'Cards', content: getFilteredSearchResults('task') },
    { title: 'Boards', content: getFilteredSearchResults('board') },
    { title: 'Workspace', content: getFilteredSearchResults('workspace') },
  ];

  return (
    <ul>
      {resultSections.map(
        ({ title, content }) =>
          content ?? (
            <li key={title}>
              <h2 className="mb-2 px-4 text-[11px] font-semibold uppercase text-gray-500">
                {title}
              </h2>
              {content}
            </li>
          ),
      )}
    </ul>
  );
}

function getSearchContent(searchResult: SearchResult): JSX.Element {
  const renderMethods: {
    [K in SearchResult['kind']]: (elem: Extract<SearchResult, { kind: K }>) => JSX.Element;
  } = {
    task: ({ id, name, board, task_list }) => (
      <Link className="hover:bg-gray-200" href={`/cards/${id}`}>
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
      <Link className="hover:bg-gray-200" href={`/boards/${id}`}>
        <div className="flex items-center gap-2 px-4 py-1">
          <BoardsIcon height={19} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
            <p className="text-[11px] text-gray-500">{workspace}</p>
          </div>
        </div>
      </Link>
    ),
    workspace: ({ id, name }) => (
      <Link className="hover:bg-gray-200" href={`/workspaces/${id}`}>
        <div className="flex items-center gap-2 px-4 py-1">
          <WorkspaceLogo className="" workspaceName={name} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
          </div>
        </div>
      </Link>
    ),
  };

  return renderMethods[searchResult.kind](searchResult);
}
