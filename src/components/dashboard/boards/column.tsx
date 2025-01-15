'use client';

import { SubsetWithId, TColumn } from '@/types/types';
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
import { DragTypeData, isColumnData } from '@/types/drag-types';
import Card from './card';

type State =
  | { type: 'idle' }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-dragging-leave';
    };

const idle: State = { type: 'idle' };

const stateStyles: {
  [key in State['type']]: string;
} = {
  idle: '',
  'is-dragging': 'opacity-40',
  'is-dragging-leave': 'opacity-80 bg-secondary-background',
};

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardList = memo(({ column }: { column: TColumn }) =>
  column.cards?.map(card => <Card key={card.id} card={card} />),
);
CardList.displayName = 'CardList';

export function Column({
  column,
  onUpdate,
  onDelete,
}: {
  column: TColumn;
  onUpdate: (cardList: SubsetWithId<TColumn>) => void;
  onDelete: (cardList: SubsetWithId<TColumn> & { id: string }) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerFullHeightRef = useRef<HTMLDivElement>(null);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState<State>({ type: 'idle' });

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    const outer = outerFullHeightRef.current;
    invariant(header);
    invariant(inner);
    invariant(outer);

    const data: DragTypeData = { id: column.id, kind: 'column' };

    return combine(
      draggable({
        element: header,
        getInitialData: () => data,
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
          return isColumnData(source.data) || isColumnData(source.data);
        },
        getIsSticky: () => true,
        onDragLeave({ source }) {
          if (isColumnData(source.data) && source.data.id === column.id) {
            setState({ type: 'is-dragging-leave' });
          }
        },
      }),
    );
  }, [column]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
      setIsOpenPopover(false);
    }
  }, [isEditing]);

  return (
    <div className="flex w-[272px] flex-shrink-0 select-none flex-col" ref={outerFullHeightRef}>
      <div
        className={`flex max-h-full flex-col rounded-xl bg-gray-200 text-sm text-primary ${stateStyles[state.type]}`}
        ref={innerRef}>
        <div
          className={`flex max-h-full flex-col ${state.type === 'is-dragging-leave' ? 'invisible' : ''}`}>
          <div className="flex cursor-pointer items-center justify-between p-2" ref={headerRef}>
            {isEditing ? (
              <textarea
                className="resize-none overflow-hidden rounded-lg px-2.5 py-1.5 font-semibold outline outline-2 outline-secondary"
                style={{ height: '32px' }}
                defaultValue={column.name}
                ref={inputRef}
                onBlur={e => {
                  const newName = e.target.value.trim();
                  if (newName && column.name !== newName) {
                    onUpdate({ id: column.id, name: newName });
                  }
                  setIsEditing(false);
                }}
                onChange={() => {
                  // TODO: Control the height of the textarea
                }}
                onKeyUp={e => e.key === 'Enter' && e.currentTarget.blur()}></textarea>
            ) : (
              <button
                type="button"
                className="grow px-2.5 text-left font-semibold"
                onMouseUp={() => {
                  setIsEditing(true);
                }}>
                <h3>{column.name}</h3>
              </button>
            )}
            <Popover
              triggerContent={
                <span className="relative flex size-8 cursor-pointer rounded-lg hover:bg-gray-300">
                  <span className="center-xy">
                    <DotsIcon width={16} height={16} />
                  </span>
                </span>
              }
              triggerClassName="[&]:p-0"
              popoverClassName="px-0 [&]:w-40"
              open={isOpenPopover}
              onOpenChange={isOpen => isOpen && setIsOpenPopover(true)}>
              <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                <li>
                  <button type="button" onClick={() => setIsEditing(true)}>
                    Rename board
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onDelete(column)}>
                    Delete board
                  </button>
                </li>
              </ul>
            </Popover>
          </div>
          {!!column.cards?.length && (
            <div className="overflow-y-auto [overflow-anchor:none] [scrollbar-width:thin]">
              <ul className="flex flex-col gap-2 p-2">
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
                <CardList column={column} />
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
}
