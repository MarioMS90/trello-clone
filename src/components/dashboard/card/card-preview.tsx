'use client';

import { memo, RefObject, useEffect, useRef, useState } from 'react';
import { TCardWithComments } from '@/types/db';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { isSafari } from '@/lib/utils/is-safari';
import { isCardData, TCardData } from '@/types/board-types';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/utils';
import { isShallowEqual } from '@/lib/utils/is-shallow-equal';
import DescriptionIcon from '@/components/icons/description';
import CommentIcon from '@/components/icons/comment';
import EditableText from '@/components/ui/editable-text';
import Popover from '@/components/ui/popover';
import PencilIcon from '@/components/icons/pencil';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardKeys } from '@/lib/card/queries';
import { deleteCard, updateCard } from '@/lib/card/actions';
import { blockCardDraggingAttr } from '@/constants/constants';
import { useRouter } from 'next/navigation';
import { commentKeys } from '@/lib/comment/queries';

type TCardState =
  | { type: 'idle' }
  | {
      type: 'is-dragging';
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
      dragging: DOMRect;
      container: HTMLElement;
    };

const idle: TCardState = { type: 'idle' };

const innerStyles: {
  [key in TCardState['type']]?: string;
} = {
  idle: 'idle',
  'is-dragging': 'opacity-40',
};

const outerStyles: { [Key in TCardState['type']]?: string } = {
  'is-dragging-and-left-self': 'hidden',
};

export function CardShadow({ dragging }: { dragging: DOMRect }) {
  return (
    <div
      className="mx-2 my-1 shrink-0 rounded-lg opacity-60 [&]:bg-gray-300"
      style={{ width: dragging.width, height: dragging.height }}></div>
  );
}

const CardDisplay = memo(function CardDisplay({
  card,
  state,
  outerRef,
  innerRef,
}: {
  card: TCardWithComments;
  state: TCardState;
  outerRef?: RefObject<HTMLLIElement | null>;
  innerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { mutate: removeCard } = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: ({ data }) => {
      invariant(data);

      queryClient.removeQueries({ queryKey: cardKeys.detail(card.id).queryKey, exact: true });
      queryClient.removeQueries({ queryKey: commentKeys.list(card.id).queryKey, exact: true });
      return queryClient.setQueryData(
        cardKeys.list(card.boardId).queryKey,
        (old: TCardWithComments[]) => old.filter(_card => _card.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  const updateCardName = useMutation({
    mutationFn: (variables: { id: string; name: string }) => updateCard(variables),
    onSuccess: ({ data }) => {
      invariant(data);

      queryClient.setQueryData(cardKeys.detail(data.id).queryKey, data);
      return queryClient.setQueryData(
        cardKeys.list(card.boardId).queryKey,
        (old: TCardWithComments[]) => old.map(_card => (_card.id === data.id ? data : _card)),
      );
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const name = updateCardName.isPending ? updateCardName.variables.name : card.name;

  return (
    <>
      {state.type === 'is-over' && state.closestEdge === 'top' ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
      <li
        className={cn(
          'group relative flex shrink-0 cursor-pointer flex-col px-2',
          outerStyles[state.type],
        )}
        ref={outerRef}>
        <button
          type="button"
          className={cn(
            'card-shadow hover:shadow-transition-effect cursor-pointer rounded-lg bg-white p-4 py-2.5',
            innerStyles[state.type],
          )}
          style={
            state.type === 'preview'
              ? {
                  width: state.dragging.width,
                  height: state.dragging.height,
                  transform: !isSafari() ? 'rotate(4deg)' : '',
                }
              : undefined
          }
          ref={innerRef}
          {...(isEditing && { [blockCardDraggingAttr]: true })}
          onClick={() => !isEditing && router.push(`/cards/${card.id}`, { scroll: false })}>
          <EditableText
            className="[&&>span]:p-0 [&&>textarea]:rounded-[3px] [&&>textarea]:p-0 [&&>textarea]:shadow-none"
            defaultText={name}
            onEdit={text => updateCardName.mutate({ id: card.id, name: text })}
            autoResize
            editing={isEditing}
            onEditingChange={setIsEditing}>
            <h2>{name}</h2>
          </EditableText>

          <div className="flex items-center gap-3 has-[span]:py-1">
            {card.description && (
              <span title="This card has a description">
                <DescriptionIcon width={16} height={16} />
              </span>
            )}
            {card.commentCount > 0 && (
              <span className="flex items-center gap-1" title="Comments">
                <CommentIcon width={16} height={16} />
                <span className="text-xs">{card.commentCount}</span>
              </span>
            )}
          </div>
        </button>
        <div
          className={cn('absolute top-1 right-3 z-20 hidden group-hover:block', {
            block: isPopoverOpen,
          })}>
          <Popover
            triggerContent={
              <span className="center-xy">
                <PencilIcon width={11} height={11} />
              </span>
            }
            triggerClassName="size-7 rounded-full hover:bg-gray-200 p-0"
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
                  Rename card
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={() => {
                    removeCard(card.id);
                    setIsPopoverOpen(false);
                  }}>
                  Delete card
                </button>
              </li>
            </ul>
          </Popover>
        </div>
      </li>
      {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
    </>
  );
});

export const CardPreview = memo(function CardPreview({ card }: { card: TCardWithComments }) {
  const [state, setState] = useState<TCardState>(idle);
  const outerRef = useRef<HTMLLIElement>(null);
  const innerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    invariant(outer);
    invariant(inner);

    const data: TCardData = {
      type: 'card',
      id: card.id,
      listId: card.listId,
      rect: inner.getBoundingClientRect(),
    };

    return combine(
      draggable({
        element: inner,
        canDrag: ({ element }) => !element.getAttribute(blockCardDraggingAttr),
        getInitialData: () => data,
        onGenerateDragPreview: ({ location, nativeSetDragImage }) => {
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
        canDrop: ({ source }) => isCardData(source.data),
        getData: ({ input, element }) =>
          attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          }),
        onDragEnter: ({ source, self }) => {
          if (!isCardData(source.data) || source.data.id === card.id) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }
          setState({ type: 'is-over', dragging: source.data.rect, closestEdge });
        },
        onDrag: ({ source, self }) => {
          if (!isCardData(source.data) || source.data.id === card.id) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }
          // optimization - Don't update react state if we don't need to.
          const proposed: TCardState = { type: 'is-over', dragging: source.data.rect, closestEdge };
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
        canMonitor: ({ source }) => isCardData(source.data) && source.data.id !== card.id,
        onDropTargetChange: ({ location }) => {
          if (!location.current.dropTargets.length) {
            return;
          }

          const dropTarget = location.current.dropTargets[0]?.data;
          if (isCardData(dropTarget) && dropTarget.id === card.id) {
            return;
          }

          setState(current => (current.type === 'idle' ? current : idle));
        },
        onDrop: () => {
          setState(current => (current.type === 'idle' ? current : idle));
        },
      }),
    );
  }, [card]);

  return (
    <>
      <CardDisplay {...{ card, state, outerRef, innerRef }} />
      {state.type === 'preview'
        ? createPortal(<CardDisplay {...{ card, state }} />, state.container)
        : null}
    </>
  );
});
