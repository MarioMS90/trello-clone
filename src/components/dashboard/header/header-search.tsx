'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BoardsIcon from '@/components/icons/boards';
import CardIcon from '@/components/icons/card';
import Loading from '@/components/ui/loading';
import NoSearchResultsIcon from '@/components/icons/no-search-results';
import SearchIcon from '@/components/icons/search';
import WorkspaceBadge from '@/components/ui/workspace-logo';
import { SearchResult } from '@/types/search-types';
import { useClickAway, useDebounce } from '@uidotdev/usehooks';
import { getClient } from '@/lib/supabase/utils';

const generateSearchResult = <T extends SearchResult['kind']>(
  searchResult: Extract<SearchResult, { kind: T }>,
): JSX.Element => {
  const searchResultRenderers: {
    [K in SearchResult['kind']]: (elem: Extract<SearchResult, { kind: K }>) => JSX.Element;
  } = {
    card: ({ id, name, board, list }) => (
      <Link className="block hover:bg-gray-200" href={`/cards/${id}`}>
        <div className="flex items-center gap-2 px-4 py-1">
          <CardIcon height={19} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
            <p className="text-[11px] text-gray-500">
              {board}: {list}
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
        <div className="flex items-center gap-2 px-4 py-2">
          <WorkspaceBadge className="[&]:size-6 [&]:text-sm" workspaceId={id} />
          <div>
            <h3 className="text-sm leading-4">{name}</h3>
          </div>
        </div>
      </Link>
    ),
  };

  return searchResultRenderers[searchResult.kind](searchResult);
};

function SearchResultsContent({ searchResults }: { searchResults: SearchResult[] }) {
  if (searchResults.length === 0) {
    return (
      <div className="flex w-full flex-col items-center text-center">
        <NoSearchResultsIcon width={124} height={124} />
        <p className="pb-1 font-medium">We couldn&apos;t find anything matching your search.</p>
        <p className="pb-2">Try again with a different term</p>
      </div>
    );
  }

  const generateContent = (kind: SearchResult['kind']): JSX.Element | null => {
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
    { title: 'Cards', content: generateContent('card') },
    { title: 'Boards', content: generateContent('board') },
    { title: 'Workspaces', content: generateContent('workspace') },
  ];

  return (
    <ul className="space-y-4">
      {resultSections.map(
        ({ title, content }) =>
          content && (
            <li key={title}>
              <h2 className="mb-1 px-4 text-[11px] font-semibold text-gray-500 uppercase">
                {title}
              </h2>
              {content}
            </li>
          ),
      )}
    </ul>
  );
}

export default function HeaderSearch({ placeholder }: { placeholder: string }) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    term: string;
    results: SearchResult[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickAwayRef = useClickAway<HTMLDivElement>(() => {
    if (!inputRef.current) {
      return;
    }

    resetSearch(true);
  });

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    resetSearch(true);
  }, [pathname]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm) {
        resetSearch();

        return;
      }

      const supabase = await getClient();
      const { data: results, error } = await supabase.rpc('search_workspaces_boards_cards', {
        search_term: debouncedSearchTerm,
      });

      if (error) {
        setSearchResults({ term: debouncedSearchTerm, results: [] });
        setIsLoading(false);
        return;
      }

      setSearchResults({ term: debouncedSearchTerm, results });
      setIsLoading(false);
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleSearch = (term: string) => {
    if (term === searchResults?.term) {
      setIsLoading(false);
      return;
    }

    setIsLoading(term !== '');
    setSearchTerm(term);
  };

  const resetSearch = (resetTerm?: boolean) => {
    if (resetTerm && inputRef.current) {
      inputRef.current.value = '';
      setSearchTerm('');
    }

    setIsLoading(false);
    setSearchResults(null);
  };

  return (
    <div
      className={`relative h-7 ${searchResults || isInputFocused ? 'w-2/4' : 'w-72'}`}
      ref={clickAwayRef}>
      <span className="absolute top-1/2 left-2 -translate-y-1/2 transform">
        <SearchIcon height={17} />
      </span>
      <input
        className={`
          size-full 
          rounded 
          border 
          border-gray-400 
          bg-white/20 
          pl-8 
          text-sm 
          text-white 
          placeholder-white 
          outline-hidden 
          hover:bg-white/30 
          ${searchResults || isInputFocused ? 'search-box-shadow' : ''}
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
            text-primary
            absolute
            inset-x-0 
            top-[calc(100%+10px)] 
            z-10 
            flex 
            min-h-20 
            flex-col 
            rounded 
            bg-white 
            pt-2 
            pb-4 
            shadow-xl 
          ">
          {isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <Loading />
            </div>
          )}
          {searchResults && !isLoading && (
            <SearchResultsContent searchResults={searchResults.results} />
          )}
        </div>
      )}
    </div>
  );
}
