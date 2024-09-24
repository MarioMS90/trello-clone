import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members',
};

export default function Page({ params }: { params: { id: string } }) {
  return 'Members page, coming soon! 🚀';
}
