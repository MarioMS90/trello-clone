'use client';

import { memo, useEffect, useRef, useState } from 'react';
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
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { isSafari } from '@/lib/utils/is-safari';
import { isCardData, TCardData } from '@/types/drag-types';

type TCardState =
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

const idle: TCardState = { type: 'idle' };

const cardStateStyles: {
  [key in TCardState['type']]?: string;
} = {
  idle: 'idle',
  'is-dragging': 'opacity-40',
  'is-dragging-and-left-self': 'opacity-60 [&]:bg-secondary-background',
};

export const Card = memo(function Card({ card, position }: { card: TCard; position: number }) {
  const [state, setState] = useState<TCardState>(idle);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    invariant(outer);
    invariant(inner);

    const data: TCardData = { type: 'card', id: card.id, position, listId: card.board_list_id };

    return combine(
      draggable({
        element: inner,
        getInitialData: () => data,
        canDrag: () => true,
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
        getData: ({ input, element }) =>
          attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          }),
        canDrop({ source }) {
          return isCardData(source.data);
        },
        getIsSticky: () => true,
        onDragLeave({ source }) {
          if (isCardData(source.data) && source.data.id === card.id) {
            setState({ type: 'is-dragging-and-left-self' });
          }
        },
      }),
    );
  }, [card, position]);

  return (
    <div
      className="card-shadow hover:shadow-transition-effect group cursor-pointer rounded-lg bg-white p-3 py-2"
      ref={outerRef}>
      <div className="relative justify-between" ref={innerRef}>
        <h2>{card.name}</h2>
        <span className="center-y absolute right-0 hidden size-7 rounded-full hover:bg-gray-200 group-hover:block">
          <span className="center-xy">
            <PencilIcon width={11} height={11} />
          </span>
        </span>
      </div>
    </div>
  );
});
