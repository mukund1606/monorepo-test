import { cn } from "@/utils";
import { Time } from "@vidstack/react";

export function TimeGroup({ className }: { className?: string }) {
  return (
    <div
      className={cn("ml-1.5 flex items-center text-sm font-medium", className)}
    >
      <Time className="time" type="current" />
      <div className="mx-1 text-white/80">/</div>
      <Time className="time" type="duration" />
    </div>
  );
}
