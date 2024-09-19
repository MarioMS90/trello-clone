import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
};

export default function Page({ params }: { params: { id: string } }) {
  return <div>My Board: {params.id}</div>;
}
