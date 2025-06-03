import DynamicBoardHeader from '@/modules/board/components/dynamic-board-header';

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DynamicBoardHeader />
      {children}
    </>
  );
}
