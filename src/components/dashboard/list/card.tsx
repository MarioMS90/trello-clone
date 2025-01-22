'use client';

import { memo } from 'react';
import PencilIcon from '@/components/icons/pencil';
import { TCard } from '@/types/types';

export const Card = memo(function Card({ card }: { card: TCard }) {
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
