'use client';

import PencilIcon from '@/components/icons/pencil';
import { TCard } from '@/types/app-types';

export default function Card({ card }: { card: TCard }) {
  return (
    <li className="group rounded-lg border border-gray-300 bg-white p-3 py-2 shadow-sm outline-2 outline-secondary hover:outline">
      <div className="relative justify-between">
        <h2>{card.name}</h2>
        <span className="center-y absolute right-0 hidden size-7 rounded-full hover:bg-gray-200 group-hover:block">
          <span className="center-xy">
            <PencilIcon width={11} height={11} />
          </span>
        </span>
      </div>
    </li>
  );
}
