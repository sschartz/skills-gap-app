import * as React from "react";
import { cn } from "@/lib/utils";

function Slider({
  value,
  onValueChange,
  max = 100,
  className,
}: {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  className?: string;
}) {
  return (
    <input
      type="range"
      min={0}
      max={max}
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={cn("w-full accent-slate-900", className)}
    />
  );
}

export { Slider };
