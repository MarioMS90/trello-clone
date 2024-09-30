import { SelectedBoards } from '@/components/dashboard/boards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
};

export default function BoardsPage() {
  return (
    <>
      <h2 className="font-bold">Boards</h2>
      <SelectedBoards />
    </>
  );
}
