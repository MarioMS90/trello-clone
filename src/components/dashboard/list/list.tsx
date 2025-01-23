'use client';

import { TList, TSubsetWithId } from '@/types/types';
import DotsIcon from '@/components/icons/dots';
import PlusIcon from '@/components/icons/plus';
import { Dispatch, memo, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import Popover from '@/components/ui/popover';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { isSafari } from '@/lib/utils/is-safari';
import { TListData, isCardData, isListData } from '@/types/drag-types';
import { cn, resizeTextarea } from '@/lib/utils/utils';
import { blockBoardPanningAttr } from '@/constants/constants';
import { createPortal } from 'react-dom';
import { Card } from './card';
import { useBoardContext } from '../board/board-context';

type TListState =
  | { type: 'idle' }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-dragging-and-left-self';
    }
  | {
      type: 'preview';
      container: HTMLElement;
      dragging: DOMRect;
    };

const listStateStyles: {
  [key in TListState['type']]?: string;
} = {
  idle: 'idle',
  'is-dragging': 'opacity-40',
  'is-dragging-and-left-self': 'opacity-60 [&]:bg-secondary-background',
};

export const ListDisplay = memo(function ListDisplay({
  list,
  state,
  isEditing,
  setIsEditing,
  isOpenPopover,
  setIsOpenPopover,
  updateList,
  deleteList,
  outerFullHeightRef,
  innerRef,
  headerRef,
  textareaRef,
}: {
  list: TList;
  state: TListState;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isOpenPopover: boolean;
  setIsOpenPopover: Dispatch<SetStateAction<boolean>>;
  updateList: (listData: TSubsetWithId<TList>) => void;
  deleteList: (id: string) => void;
  outerFullHeightRef?: RefObject<HTMLDivElement | null>;
  innerRef?: RefObject<HTMLDivElement | null>;
  headerRef?: RefObject<HTMLDivElement | null>;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex w-[272px] flex-shrink-0 flex-col" ref={outerFullHeightRef}>
      <div
        className={cn(
          'flex max-h-full flex-col rounded-xl bg-[#f1f2f4] text-sm text-primary',
          listStateStyles[state.type],
          {
            'rotate-[4deg]': state.type === 'preview' && !isSafari(),
          },
        )}
        ref={innerRef}
        {...{ [blockBoardPanningAttr]: true }}>
        <div
          className={cn('flex max-h-full flex-col', {
            invisible: state.type === 'is-dragging-and-left-self',
          })}>
          <div
            className="flex cursor-pointer items-center justify-between px-2 pt-2"
            ref={headerRef}>
            {isEditing && textareaRef ? (
              <textarea
                className="shadow-transition focus:shadow-transition-effect grow resize-none overflow-hidden rounded-lg bg-gray-200 px-2.5 py-1.5 font-semibold outline-none focus:bg-white"
                defaultValue={list.name}
                style={{ height: '32px' }}
                onChange={() => resizeTextarea(textareaRef)}
                draggable={false}
                onBlur={e => {
                  const newName = e.target.value.trim();
                  if (newName && list.name !== newName) {
                    updateList({ id: list.id, name: newName });
                  }
                  setIsEditing(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                onKeyUp={e => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsEditing(false);
                  }
                }}
                ref={textareaRef}></textarea>
            ) : (
              <button
                type="button"
                className="grow px-2.5 py-1.5 text-left font-semibold"
                onMouseUp={() => {
                  setIsEditing(true);
                }}>
                <h3 className="[overflow-wrap:anywhere]">{list.name}</h3>
              </button>
            )}
            <Popover
              triggerContent={
                <span className="relative flex size-8 rounded-lg hover:bg-gray-300">
                  <span className="center-xy">
                    <DotsIcon width={16} height={16} />
                  </span>
                </span>
              }
              triggerClassName="[&]:p-0"
              popoverClassName="px-0 [&]:w-40"
              open={isOpenPopover}
              onOpenChange={setIsOpenPopover}>
              <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                <li>
                  <button type="button" onClick={() => setIsEditing(true)}>
                    Rename list
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => deleteList(list.id)}>
                    Delete list
                  </button>
                </li>
              </ul>
            </Popover>
          </div>
          {!!list.cards?.length && (
            <div className="overflow-y-auto [overflow-anchor:none] [scrollbar-width:thin]">
              <ul className="flex flex-col gap-2 p-2">
                {list.cards.map(card => (
                  <Card key={card.id} card={card} />
                ))}
              </ul>
            </div>
          )}
          <div className="p-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-300">
              <PlusIcon width={16} height={16} />
              Add a card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const idle: TListState = { type: 'idle' };

export const List = memo(function List({ list, position }: { list: TList; position: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [state, setState] = useState<TListState>(idle);
  const outerFullHeightRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateList, deleteList } = useBoardContext();

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    const outer = outerFullHeightRef.current;

    invariant(inner);
    invariant(outer);
    invariant(header);

    const data: TListData = { type: 'list', id: list.id, originalPosition: position };

    return combine(
      draggable({
        element: header,
        getInitialData: () => data,
        canDrag: () => true,
        onGenerateDragPreview: ({ source, location, nativeSetDragImage }) => {
          invariant(isListData(source.data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({ element: inner, input: location.current.input }),
            render({ container }) {
              setState({
                type: 'preview',
                container,
                dragging: inner.getBoundingClientRect(),
              });
            },
          });
        },
        onDragStart: () => setState({ type: 'is-dragging' }),
        onDrop: () => {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getData: ({ input, element }) =>
          attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          }),
        canDrop({ source }) {
          return isListData(source.data) || isCardData(source.data);
        },
        getIsSticky: () => true,
        onDragLeave({ source }) {
          if (isListData(source.data) && source.data.id === list.id) {
            setState({ type: 'is-dragging-and-left-self' });
          }
        },
      }),
    );
  }, [list, position]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (isEditing && textarea) {
      resizeTextarea(textareaRef);
      setIsOpenPopover(false);
      textarea.select();
    }
  }, [isEditing]);

  const listDisplayProps = {
    list,
    state,
    isEditing,
    setIsEditing,
    isOpenPopover,
    setIsOpenPopover,
    updateList,
    deleteList,
  };

  return (
    <>
      <ListDisplay
        {...listDisplayProps}
        {...{ outerFullHeightRef, innerRef, headerRef, textareaRef }}
      />
      {state.type === 'preview'
        ? createPortal(<ListDisplay {...listDisplayProps} />, state.container)
        : null}
    </>
  );
});
