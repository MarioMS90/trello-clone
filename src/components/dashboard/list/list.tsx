'use client';

import { TList } from '@/types/db';
import DotsIcon from '@/components/icons/dots';
import PlusIcon from '@/components/icons/plus';
import { memo, RefObject, useEffect, useRef, useState } from 'react';
import Popover from '@/components/ui/popover';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { isSafari } from '@/lib/utils/is-safari';
import { TListData, isCardData, isListData } from '@/types/drag-types';
import { cn } from '@/lib/utils/utils';
import { blockBoardPanningAttr, blockListDraggingAttr } from '@/constants/constants';
import { createPortal } from 'react-dom';
import EditableText from '@/components/ui/editable-text';
import { isShallowEqual } from '@/lib/utils/is-shallow-equal';
import { useClickAway } from '@uidotdev/usehooks';
import { Card, CardShadow } from '../card/card';
import { useBoardContext } from '../board/board-context';
import { CreateCard } from '../card/create-card';

type TListState =
  | { type: 'idle' }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-card-over';
      isOverChildCard: boolean;
      dragging: DOMRect;
    }
  | {
      type: 'is-dragging-and-left-self';
    }
  | {
      type: 'is-over';
      dragging: DOMRect;
      closestEdge: Edge;
    }
  | {
      type: 'preview';
      container: HTMLElement;
    };

const idle: TListState = { type: 'idle' };

const innerStyles: {
  [key in TListState['type']]?: string;
} = {
  idle: 'idle',
  'is-dragging': 'opacity-40',
  'is-card-over': 'outline outline-2 outline-primary-border',
};

const outerStyles: { [Key in TListState['type']]?: string } = {
  'is-dragging-and-left-self': 'hidden',
};

function ListShadow({ dragging }: { dragging: DOMRect }) {
  return (
    <div
      className="mx-2 flex-shrink-0 rounded-xl opacity-60 [&]:bg-secondary-background"
      style={{ width: dragging.width, height: dragging.height }}></div>
  );
}

const ListDisplay = memo(function ListDisplay({
  list,
  state,
  outerFullHeightRef,
  innerRef,
  headerRef,
  scrollableRef,
}: {
  list: TList;
  state: TListState;
  outerFullHeightRef?: RefObject<HTMLLIElement | null>;
  innerRef?: RefObject<HTMLDivElement | null>;
  headerRef?: RefObject<HTMLDivElement | null>;
  scrollableRef?: RefObject<HTMLDivElement | null>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const { updateList, deleteList, addCard } = useBoardContext();
  const clickAwayRef = useClickAway<HTMLLIElement>(() => {
    if (isCreatingCard) {
      setIsCreatingCard(false);
    }
  });

  return (
    <>
      {state.type === 'is-over' && state.closestEdge === 'left' ? (
        <ListShadow dragging={state.dragging} />
      ) : null}
      <li
        className={cn('flex flex-shrink-0 flex-col px-1.5', outerStyles[state.type])}
        ref={outerFullHeightRef}>
        <div
          className={cn(
            'flex max-h-full w-[272px] flex-col rounded-xl bg-[#f1f2f4] pb-2 text-sm text-primary',
            innerStyles[state.type],
          )}
          style={
            state.type === 'preview'
              ? {
                  transform: !isSafari() ? 'rotate(4deg)' : '',
                }
              : undefined
          }
          ref={innerRef}
          {...{ [blockBoardPanningAttr]: true }}>
          <div className="flex max-h-full flex-col">
            <div
              className="flex cursor-pointer justify-between px-2 pt-2"
              ref={headerRef}
              {...(isEditing && { [blockListDraggingAttr]: true })}>
              <EditableText
                className="font-semibold [&>button]:px-3 [&>textarea]:px-3"
                defaultText={list.name}
                onEdit={name => updateList({ id: list.id, name })}
                autoResize
                editOnClick
                editing={isEditing}
                onEditingChange={setIsEditing}>
                <h3 className="[overflow-wrap:anywhere]">{list.name}</h3>
              </EditableText>
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
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setIsOpenPopover(false);
                      }}>
                      Rename list
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        deleteList(list.id);
                        setIsOpenPopover(false);
                      }}>
                      Delete list
                    </button>
                  </li>
                </ul>
              </Popover>
            </div>
            <div
              className="overflow-y-auto [overflow-anchor:none] [scrollbar-width:thin] has-[li]:mt-1.5"
              ref={scrollableRef}>
              <ul className="flex flex-col gap-2 has-[li]:py-0.5">
                {list.cards.map(card => (
                  <Card card={card} key={card.id} />
                ))}
                {isCreatingCard && (
                  <CreateCard
                    onCardCreated={cardName => addCard(list.id, cardName)}
                    onCancel={() => setIsCreatingCard(false)}
                    ref={clickAwayRef}
                  />
                )}
                {state.type === 'is-card-over' && !state.isOverChildCard ? (
                  <CardShadow dragging={state.dragging} />
                ) : null}
              </ul>
            </div>
            {!isCreatingCard && (
              <div className="px-2 pt-2">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-300"
                  onClick={() => setIsCreatingCard(true)}>
                  <PlusIcon width={16} height={16} />
                  Add a card
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
      {state.type === 'is-over' && state.closestEdge === 'right' ? (
        <ListShadow dragging={state.dragging} />
      ) : null}
    </>
  );
});

export const List = memo(function List({ list }: { list: TList }) {
  const [state, setState] = useState<TListState>(idle);
  const outerFullHeightRef = useRef<HTMLLIElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const inner = innerRef.current;
    const header = headerRef.current;
    const scrollable = scrollableRef.current;

    invariant(outer);
    invariant(inner);
    invariant(header);
    invariant(scrollable);

    const data: TListData = { type: 'list', id: list.id, rect: inner.getBoundingClientRect() };

    return combine(
      draggable({
        element: header,
        canDrag: ({ element }) => !element.getAttribute(blockListDraggingAttr),
        getInitialData: () => data,
        onGenerateDragPreview: ({ location, nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({ element: inner, input: location.current.input }),
            render({ container }) {
              setState({
                type: 'preview',
                container,
              });
            },
          });
        },
        onDragStart: () => setState({ type: 'is-dragging' }),
        onDropTargetChange: ({ location }) => {
          if (!location.current.dropTargets.length) {
            return;
          }

          setState({ type: 'is-dragging-and-left-self' });
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop: ({ source }) => isListData(source.data) || isCardData(source.data),
        getData: ({ input, element }) =>
          attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          }),
        onDragStart: ({ source }) => {
          if (!isCardData(source.data) || source.data.id === list.id) {
            return;
          }

          setState({
            type: 'is-card-over',
            dragging: source.data.rect,
            isOverChildCard: true,
          });
        },
        onDragEnter: ({ source, location, self }) => {
          if (isListData(source.data) && source.data.id !== list.id) {
            const closestEdge = extractClosestEdge(self.data);
            if (!closestEdge) {
              return;
            }
            setState({ type: 'is-over', dragging: source.data.rect, closestEdge });
          }

          if (isCardData(source.data)) {
            const innerMost = location.current.dropTargets[0];
            const isOverChildCard = Boolean(innerMost && isCardData(innerMost.data));

            const proposed: TListState = {
              type: 'is-card-over',
              dragging: source.data.rect,
              isOverChildCard,
            };
            // optimization - don't update state if we don't need to.
            setState(current => {
              if (isShallowEqual(proposed, current)) {
                return current;
              }

              return proposed;
            });
          }
        },
        onDropTargetChange: ({ source, location }) => {
          const dropTarget = location.current.dropTargets[0]?.data;
          if (!isCardData(source.data) || !isCardData(dropTarget)) {
            return;
          }

          const proposed: TListState = {
            type: 'is-card-over',
            dragging: dropTarget.rect,
            isOverChildCard: true,
          };

          setState(current => {
            if (isShallowEqual(proposed, current)) {
              return current;
            }

            return proposed;
          });
        },
        onDrag: ({ source, self }) => {
          if (!isListData(source.data) || source.data.id === list.id) {
            return;
          }

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }
          // optimization - Don't update react state if we don't need to.
          const proposed: TListState = { type: 'is-over', dragging: source.data.rect, closestEdge };
          setState(current => {
            if (isShallowEqual(proposed, current)) {
              return current;
            }
            return proposed;
          });
        },
      }),
      // A shadow is always displayed, even when the mouse leaves the viewport.
      // Using monitorForElements, we can trigger the necessary events to remove
      // the shadow on components that are no longer being targeted.
      monitorForElements({
        canMonitor: ({ source }) =>
          (isListData(source.data) && source.data.id !== list.id) || isCardData(source.data),
        onDropTargetChange: ({ location }) => {
          const [firstTarget, secondTarget] = location.current.dropTargets;
          const listTarget = isListData(firstTarget?.data) ? firstTarget.data : secondTarget?.data;
          if (!isListData(listTarget) || listTarget.id === list.id) {
            return;
          }

          setState(current => (current.type === 'idle' ? current : idle));
        },
        onDrop: () => {
          setState(current => (current.type === 'idle' ? current : idle));
        },
      }),
      autoScrollForElements({
        canScroll: ({ source }) => isCardData(source.data),
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
        element: scrollable,
      }),
    );
  }, [list]);

  return (
    <>
      <ListDisplay {...{ list, state, outerFullHeightRef, innerRef, headerRef, scrollableRef }} />
      {state.type === 'preview'
        ? createPortal(<ListDisplay {...{ list, state }} />, state.container)
        : null}
    </>
  );
});
