import ArrowDownIcon from './icons/arrow-down';
import WorkspaceLogo from './ui/workspace-logo';

export default function SideNav() {
  return (
    <nav className="bg-secondary-background w-[260px] p-3 text-white">
      <div className="flex items-center gap-2">
        <WorkspaceLogo />
        <h3 className="text-sm font-bold">Mario workspace</h3>
        <div className="rotate-90">
          <ArrowDownIcon height="16px" />
        </div>
      </div>
    </nav>
  );
}
