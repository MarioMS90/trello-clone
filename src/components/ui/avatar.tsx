export default function Avatar({ userName }: { userName: string }) {
  return (
    <div className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-xs text-white">
      {userName[0].toUpperCase()}
    </div>
  );
}
