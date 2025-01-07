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
        flex 
        size-8 
        items-center 
        justify-center 
        rounded 
        bg-secondary 
        text-xl 
        font-bold 
        text-white 
        ${className}
      `}>
      {workspaceName[0].toUpperCase()}
    </div>
  );
}
