'use client';

import { TCard, TList } from '@/modules/common/types/db';
import { memo, RefObject, useEffect, useRef, useState } from 'react';
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
import { isSafari } from '@/modules/common/utils/is-safari';
import { TListData, isCardData, isListData } from '@/modules/board/types/board';
import { cn } from '@/modules/common/utils/utils';
import { blockBoardPanningAttr, blockListDraggingAttr } from '@/modules/common/constants/constants';
import { createPortal } from 'react-dom';
import { isShallowEqual } from '@/modules/common/utils/is-shallow-equal';
import { useCards } from '@/modules/card/lib/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteList, updateList } from '@/modules/list/lib/actions';
import { listKeys } from '@/modules/list/lib/queries';
import PlusIcon from '@/modules/common/components/icons/plus';
import DotsIcon from '@/modules/common/components/icons/dots';
import EditableText from '@/modules/common/components/ui/editable-text';
import Popover from '@/modules/common/components/ui/popover';
import { CreateCard } from '@/modules/card/components/create-card';
import { CardPreview, CardShadow } from '@/modules/card/components/card-preview';
import { deleteQueryData, updateQueryData } from '@/modules/common/lib/react-query/utils';

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
      className="[&]:bg-secondary-background mx-1.5 shrink-0 rounded-xl opacity-60"
      style={{ width: dragging.width, height: dragging.height }}></div>
  );
}

const ListDisplay = memo(function ListDisplay({
  list,
  cards,
  state,
  outerFullHeightRef,
  innerRef,
  headerRef,
  scrollableRef,
}: {
  list: TList;
  cards: TCard[];
  state: TListState;
  outerFullHeightRef?: RefObject<HTMLLIElement | null>;
  innerRef?: RefObject<HTMLDivElement | null>;
  headerRef?: RefObject<HTMLDivElement | null>;
  scrollableRef?: RefObject<HTMLDivElement | null>;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const { queryKey } = listKeys.list(list.boardId);

  const updateListName = useMutation({
    mutationFn: (variables: { id: string; name: string }) => updateList(variables),
    onSuccess: ({ data }) => {
      invariant(data);

      updateQueryData({
        queryClient,
        queryKey,
        entity: data,
      });
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const { mutate: removeList } = useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: ({ data }) => {
      invariant(data);

      deleteQueryData({
        queryClient,
        queryKey,
        entityId: data.id,
      });
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  const listName = updateListName.isPending ? updateListName.variables.name : list.name;

  return (
    <>
      {state.type === 'is-over' && state.closestEdge === 'left' ? (
        <ListShadow dragging={state.dragging} />
      ) : null}
      <li
        className={cn('flex shrink-0 flex-col px-1.5', outerStyles[state.type])}
        ref={outerFullHeightRef}>
        <div
          className={cn(
            'text-primary flex max-h-full w-[272px] flex-col rounded-xl bg-[#f1f2f4] pb-2 text-sm',
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
                defaultText={listName}
                onEdit={text => updateListName.mutate({ id: list.id, name: text })}
                autoResize
                editOnClick
                editing={isEditing}
                onEditingChange={setIsEditing}>
                <h3 className="[overflow-wrap:anywhere]">{listName}</h3>
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
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}>
                <ul className="text-sm [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left [&>li>button:hover]:bg-gray-200">
                  <li>
                    <button
                      className="cursor-pointer"
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setIsPopoverOpen(false);
                      }}>
                      Rename list
                    </button>
                  </li>
                  <li>
                    <button
                      className="cursor-pointer"
                      type="button"
                      onClick={() => {
                        removeList(list.id);
                        setIsPopoverOpen(false);
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
                {cards.map(card => (
                  <CardPreview card={card} key={card.id} />
                ))}
                {isCreatingCard && (
                  <CreateCard list={list} onCancel={() => setIsCreatingCard(false)} />
                )}
                {state.type === 'is-card-over' && !state.isOverChildCard ? (
                  <CardShadow dragging={state.dragging} />
                ) : null}
              </ul>
            </div>
            {!isCreatingCard && (
              <div className="px-2 pt-2">
                <button
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-gray-300"
                  type="button"
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
  const { data: cards } = useCards(list.boardId, list.id);
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
      <ListDisplay
        {...{
          list,
          cards,
          state,
          outerFullHeightRef,
          innerRef,
          headerRef,
          scrollableRef,
        }}
      />
      {state.type === 'preview'
        ? createPortal(<ListDisplay {...{ list, cards, state }} />, state.container)
        : null}
    </>
  );
});
