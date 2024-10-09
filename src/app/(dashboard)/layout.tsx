import Header from '@/components/dashboard/header';

export default function WorkspacesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100%-48px)]">{children}</div>
    </>
  );
}
