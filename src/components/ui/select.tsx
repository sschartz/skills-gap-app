import * as React from "react";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue>({});

function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
}

function SelectTrigger({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
}

function SelectValue() {
  const { value } = React.useContext(SelectContext);
  return <span>{value}</span>;
}

function SelectContent({ className, children }: React.HTMLAttributes<HTMLSelectElement>) {
  const { value, onValueChange } = React.useContext(SelectContext);
  const items: Array<{ value: string; label: React.ReactNode }> = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement<{ value: string; children: React.ReactNode }>(child)) {
      items.push({ value: child.props.value, label: child.props.children });
    }
  });

  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        className
      )}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label as string}
        </option>
      ))}
    </select>
  );
}

function SelectItem(_props: { value: string; children: React.ReactNode }) {
  return null;
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
