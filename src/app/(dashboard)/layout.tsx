import Header from '@/components/header';
import SideNav from '@/components/sidenav';
import { WorkspacesStoreProvider } from '@/providers/workspaces-store-provider';

const workspacesTest = [
  {
    id: 'a0a3a1c4-ac37-4409-8017-6b50bf664a45',
    name: 'Mario workspace',
    boards: [
      {
        id: '1',
        name: 'My board',
        marked: true,
      },
      {
        id: '2',
        name: 'Another board',
        marked: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Work',
    boards: [
      {
        id: '3',
        name: 'Work board',
        marked: false,
      },
      {
        id: '4',
        name: 'Another work board',
        marked: true,
      },
    ],
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WorkspacesStoreProvider workspaces={workspacesTest}>
      <Header />
      <div className="flex h-[calc(100%-48px)]">
        <SideNav />
        <main className="grow bg-main-background pl-4 pt-2">{children}</main>
      </div>
    </WorkspacesStoreProvider>
  );
}
