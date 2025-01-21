'use client';

import { TList } from '@/types/types';
import DotsIcon from '@/components/icons/dots';
import PlusIcon from '@/components/icons/plus';
import { memo, useEffect, useRef, useState } from 'react';
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
import { resizeTextarea } from '@/lib/utils/utils';
import { blockBoardPanningAttr } from '@/constants/constants';
import { Card } from './card';
import { useBoardContext } from '../boards/board-context';

type TListState =
  | { type: 'idle' }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-dragging-leave';
    };

const idle: TListState = { type: 'idle' };

const listStateStyles: {
  [key in TListState['type']]: string;
} = {
  idle: '',
  'is-dragging': 'opacity-40',
  'is-dragging-leave': 'opacity-60 bg-secondary-background',
};

export const List = memo(function List({ list, position }: { list: TList; position: number }) {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState<TListState>({ type: 'idle' });
  const outerFullHeightRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateList, deleteList } = useBoardContext();

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    const outer = outerFullHeightRef.current;
    invariant(header);
    invariant(inner);
    invariant(outer);

    const data: TListData = { type: 'list', id: list.id, originalPosition: position };

    return combine(
      draggable({
        element: header,
        getInitialData: () => data,
        canDrag: () => !isEditing,
        onGenerateDragPreview: ({ source, location, nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            getOffset: preserveOffsetOnSource({
              element: source.element,
              input: location.current.input,
            }),
            render: ({ container }) => {
              const rect = inner.getBoundingClientRect();
              const preview = inner.cloneNode(true);
              invariant(preview instanceof HTMLElement);
              preview.style.width = `${rect.width}px`;
              preview.style.height = `${rect.height}px`;

              // rotation of native drag previews does not work in safari
              if (!isSafari()) {
                preview.style.transform = 'rotate(4deg)';
              }

              container.appendChild(preview);
            },
            nativeSetDragImage,
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
            setState({ type: 'is-dragging-leave' });
          }
        },
      }),
    );
  }, [list, position, isEditing]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (isEditing && textarea) {
      resizeTextarea(textareaRef);
      setIsOpenPopover(false);
      textarea.select();
    }
  }, [isEditing]);

  return (
    <div className="flex w-[272px] flex-shrink-0 select-none flex-col" ref={outerFullHeightRef}>
      <div
        className={`flex max-h-full flex-col rounded-xl bg-gray-200 text-sm text-primary ${listStateStyles[state.type]}`}
        ref={innerRef}
        {...{ [blockBoardPanningAttr]: true }}>
        <div
          className={`flex max-h-full flex-col ${state.type === 'is-dragging-leave' ? 'invisible' : ''}`}>
          <div
            className="flex cursor-pointer items-center justify-between px-2 pt-2"
            ref={headerRef}>
            {isEditing ? (
              <textarea
                className="shadow-transition grow resize-none overflow-hidden rounded-lg bg-gray-200 px-2.5 py-1.5 font-semibold outline-none focus:bg-white"
                defaultValue={list.name}
                style={{ height: '32px' }}
                onChange={() => resizeTextarea(textareaRef)}
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
