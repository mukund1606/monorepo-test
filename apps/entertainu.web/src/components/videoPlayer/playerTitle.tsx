import { cn } from "@/utils";
import { ChapterTitle, useMediaState } from "@vidstack/react";

export function Title({ className }: { className?: string }) {
  const title = useMediaState("title");
  if (!title) return null;
  return (
    <span
      className={cn(
        "inline-block flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm font-medium text-white/70",
        className,
      )}
    >
      <span className="mr-1">|</span>
      <ChapterTitle />
    </span>
  );
}
