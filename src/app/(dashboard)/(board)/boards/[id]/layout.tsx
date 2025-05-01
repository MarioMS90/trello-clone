export default function BoardLayout({
  children,
  card,
}: Readonly<{
  children: React.ReactNode;
  card: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {card}
    </>
  );
}
