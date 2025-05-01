export default function WorkspaceBadge({
  className,
  workspaceName,
}: {
  className?: string;
  workspaceName: string;
}) {
  return (
    <div
      className={`
        bg-secondary 
        text-md 
        flex 
        size-8 
        items-center 
        justify-center 
        rounded 
        font-bold 
        text-white 
        ${className}
      `}>
      {workspaceName[0].toUpperCase()}
    </div>
  );
}
