"use client";

import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import { useState } from "react";

export function reorderItems<T>(items: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return items;
  }
  const next = [...items];
  const moved = next[from];
  if (moved === undefined) return items;
  next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

type DragHandleProps = {
  label?: string;
  className?: string;
};

export function AdminDragHandle({ label, className }: DragHandleProps) {
  return (
    <span
      className={cn(
        "inline-flex cursor-grab touch-none items-center text-muted-foreground active:cursor-grabbing",
        className
      )}
      aria-label={label ?? "Arrastrar para reordenar"}
    >
      <GripVertical className="h-4 w-4" />
    </span>
  );
}

type SortableRowProps = {
  id: string;
  index: number;
  onReorder: (from: number, to: number) => void;
  children: ReactNode;
  className?: string;
  dragHandle?: ReactNode;
};

export function AdminSortableRow({
  id,
  index,
  onReorder,
  children,
  className,
  dragHandle,
}: SortableRowProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const from = Number.parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (Number.isFinite(from) && from !== index) {
      onReorder(from, index);
    }
  };

  return (
    <div
      data-sortable-id={id}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        className,
        dragOver && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
      )}
    >
      {dragHandle ?? <AdminDragHandle className="mr-2 shrink-0" />}
      {children}
    </div>
  );
}
