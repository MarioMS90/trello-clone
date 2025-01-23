'use client';

import { memo, useEffect } from 'react';
import PencilIcon from '@/components/icons/pencil';
import { TCard } from '@/types/types';

export const Card = memo(function Card({ card }: { card: TCard }) {
  // const innerRef = useRef<HTMLDivElement | null>(null);
  // const [state, setState] = useState<TCardState>(idle);

  //   useEffect(() => {
  //     const header = headerRef.current;
  //     const inner = innerRef.current;
  //     const outer = outerFullHeightRef.current;
  //     invariant(header);
  //     invariant(inner);
  //     invariant(outer);

  //     const data: TListData = { type: 'list', id: list.id, originalPosition: position };

  //     return combine(
  //       draggable({
  //         element: header,
  //         getInitialData: () => data,
  //         canDrag: () => !isEditing,
  //         onGenerateDragPreview: ({ source, location, nativeSetDragImage }) => {
  //           setCustomNativeDragPreview({
  //             getOffset: preserveOffsetOnSource({
  //               element: source.element,
  //               input: location.current.input,
  //             }),
  //             render: ({ container }) => {
  //               const rect = inner.getBoundingClientRect();
  //               const preview = inner.cloneNode(true);
  //               invariant(preview instanceof HTMLElement);
  //               preview.style.width = `${rect.width}px`;
  //               preview.style.height = `${rect.height}px`;

  //               // rotation of native drag previews does not work in safari
  //               if (!isSafari()) {
  //                 preview.style.transform = 'rotate(4deg)';
  //               }

  //               container.appendChild(preview);
  //             },
  //             nativeSetDragImage,
  //           });
  //         },
  //         onDragStart: () => setState({ type: 'is-dragging' }),
  //         onDrop: () => {
  //           setState(idle);
  //         },
  //       }),
  //       dropTargetForElements({
  //         element: outer,
  //         getData: ({ input, element }) =>
  //           attachClosestEdge(data, {
  //             input,
  //             element,
  //             allowedEdges: ['left', 'right'],
  //           }),
  //         canDrop({ source }) {
  //           return isListData(source.data) || isCardData(source.data);
  //         },
  //         getIsSticky: () => true,
  //         onDragLeave({ source }) {
  //           if (isListData(source.data) && source.data.id === list.id) {
  //             setState({ type: 'is-dragging-and-self-left' });
  //           }
  //         },
  //       }),
  //     );
  //   }, [list, position, isEditing]);

  return (
    <li>
      <div className="card-shadow hover:shadow-transition-effect group cursor-pointer rounded-lg bg-white p-3 py-2">
        <div className="relative justify-between">
          <h2>{card.name}</h2>
          <span className="center-y absolute right-0 hidden size-7 rounded-full hover:bg-gray-200 group-hover:block">
            <span className="center-xy">
              <PencilIcon width={11} height={11} />
            </span>
          </span>
        </div>
      </div>
    </li>
  );
});
