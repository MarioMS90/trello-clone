import DynamicBoardHeader from '@/components/dashboard/board/dynamic-board-header';

export default function BoardLayout({
  children,
  card,
}: Readonly<{
  children: React.ReactNode;
  card: React.ReactNode;
}>) {
  return (
    <>
      <DynamicBoardHeader />
      {children}
      {card}
    </>
  );
}
