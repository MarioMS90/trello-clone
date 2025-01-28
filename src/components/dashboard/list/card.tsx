'use client';

import { memo, RefObject, useEffect, useRef, useState } from 'react';
import PencilIcon from '@/components/icons/pencil';
import { TCard } from '@/types/types';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
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
import { isCardData, TCardData } from '@/types/drag-types';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/utils';
import { isShallowEqual } from '@/lib/utils/is-shallow-equal';

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
      className="mx-2 my-1 flex-shrink-0 rounded-lg opacity-60 [&]:bg-gray-300"
      style={{ width: dragging.width, height: dragging.height }}></div>
  );
}

const CardDisplay = memo(function CardDisplay({
  card,
  state,
  outerRef,
  innerRef,
}: {
  card: TCard;
  state: TCardState;
  outerRef?: RefObject<HTMLLIElement | null>;
  innerRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      {state.type === 'is-over' && state.closestEdge === 'top' ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
      <li
        className={cn(
          'group flex flex-shrink-0 cursor-pointer flex-col px-2 py-1',
          outerStyles[state.type],
        )}
        ref={outerRef}>
        <div
          className={cn(
            'card-shadow hover:shadow-transition-effect relative rounded-lg bg-white p-3 py-2',
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
          ref={innerRef}>
          <h2>{card.name}</h2>
          <span className="center-y absolute right-1.5 hidden size-7 rounded-full hover:bg-gray-200 group-hover:block">
            <span className="center-xy">
              <PencilIcon width={11} height={11} />
            </span>
          </span>
        </div>
      </li>
      {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
        <CardShadow dragging={state.dragging} />
      ) : null}
    </>
  );
});

export const Card = memo(function Card({ card }: { card: TCard }) {
  const [state, setState] = useState<TCardState>(idle);
  const outerRef = useRef<HTMLLIElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    invariant(outer);
    invariant(inner);

    const data: TCardData = {
      type: 'card',
      id: card.id,
      listId: card.board_list_id,
      rect: inner.getBoundingClientRect(),
    };

    return combine(
      draggable({
        element: inner,
        canDrag: () => true,
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
        onDrop: () => {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop({ source }) {
          return isCardData(source.data);
        },
        getData: ({ input, element }) =>
          attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          }),
        onDragEnter({ source, self }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.id === card.id) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }
          setState({ type: 'is-over', dragging: source.data.rect, closestEdge });
        },
        onDrag({ source, self }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.id === card.id) {
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
        onDragLeave({ source }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.id === card.id) {
            setState({ type: 'is-dragging-and-left-self' });
            return;
          }

          setState(idle);
        },
        onDrop() {
          setState(idle);
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
