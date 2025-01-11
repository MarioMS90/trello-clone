'use client';

import { TCardList, SubsetWithId } from '@/types/app-types';
import DotsIcon from '@/components/icons/dots';
import PlusIcon from '@/components/icons/plus';
import PencilIcon from '@/components/icons/pencil';
import { useEffect, useRef, useState } from 'react';
import Popover from '@/components/ui/popover';
import invariant from 'tiny-invariant';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { centerUnderPointer } from '@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

type State =
  | { type: 'idle' }
  | { type: 'generate-preview'; container: HTMLElement }
  | { type: 'generate-preview-safari'; container: HTMLElement };

const idle: State = { type: 'idle' };

const stateClassnames: {
  [key in State['type']]: string;
} = {
  idle: '',
  'generate-preview': 'rotate-6',
  'generate-preview-safari': '',
};

export function CardList({
  cardList,
  onUpdate,
  onDelete,
}: {
  cardList: TCardList;
  onUpdate: (cardList: SubsetWithId<TCardList>) => void;
  onDelete: (cardList: SubsetWithId<TCardList> & { id: string }) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cardListRef = useRef(null);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState<State>({ type: 'idle' });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const cardListElement = cardListRef.current;
    invariant(cardListElement);
    return draggable({
      element: cardListElement,
      onDragStart: () => setIsDragging(true),
      onDrop: () => {
        setState(idle);
        setIsDragging(false);
      },
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        const isSafari: boolean =
          navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome');

        setCustomNativeDragPreview({
          getOffset: centerUnderPointer,
          render: ({ container }) => {
            setState({
              type: isSafari ? 'generate-preview-safari' : 'generate-preview',
              container,
            });

            return () => setState(idle);
          },
          nativeSetDragImage,
        });
      },
    });
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
      setIsOpenPopover(false);
    }
  }, [isEditing]);

  return (
    <>
      <div
        className={cn(
          `w-[272px] rounded-xl bg-gray-200 text-sm text-primary ${stateClassnames[state.type]}`,
          {
            'opacity-40': isDragging,
          },
        )}
        ref={cardListRef}>
        <div className="p-2">
          <div className="flex cursor-pointer items-center justify-between">
            {isEditing ? (
              <textarea
                className="resize-none overflow-hidden rounded-lg px-2.5 py-1.5 font-semibold outline outline-2 outline-secondary"
                style={{ height: '32px' }}
                defaultValue={cardList.name}
                ref={inputRef}
                onBlur={e => {
                  const newName = e.target.value.trim();
                  if (newName && cardList.name !== newName) {
                    onUpdate({ id: cardList.id, name: newName });
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
                <h3>{cardList.name}</h3>
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
              triggerClassName="[&]:p-1"
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
                  <button type="button" onClick={() => onDelete(cardList)}>
                    Delete board
                  </button>
                </li>
              </ul>
            </Popover>
          </div>
          {!!cardList.cards?.length && (
            <ul className="flex flex-col gap-2 pt-2">
              {cardList.cards.map(({ id, name }) => (
                <li
                  className="group cursor-pointer rounded-lg border border-gray-300 bg-white px-1 py-2 shadow-sm outline-2 outline-secondary hover:outline"
                  key={id}>
                  <div className="relative justify-between px-2">
                    <h2>{name}</h2>
                    <span className="center-y absolute right-0 hidden size-7 cursor-pointer rounded-full hover:bg-gray-200 group-hover:block">
                      <span className="center-xy">
                        <PencilIcon width={11} height={11} />
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div>
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-300">
              <PlusIcon width={16} height={16} />
              Add a card
            </button>
          </div>
        </div>
      </div>
      {state.type === 'generate-preview'
        ? createPortal(
            <CardList cardList={cardList} onUpdate={onUpdate} onDelete={onDelete} />,
            state.container,
          )
        : null}
    </>
  );
}
