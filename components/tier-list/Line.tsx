"use client";

import { Card } from "./Card";
import type { TierRow } from "@/types/TierRow";
import type { TierItem } from "@/types/TierItem";

type LineProps = {
  row: TierRow;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, item: TierItem) => void;
  "data-row-id"?: string;
};

export function Line({ row, onDragOver, onDrop, onDragStart, ...rest }: LineProps) {
  return (
    <div
      className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-card-border"
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...rest}
    >
      <div className={`flex items-center justify-center w-16 min-h-18 ${row.backgroundColorClass} text-lg font-bold shrink-0`}>
        {row.label}
      </div>
      <div className="flex flex-wrap gap-2 p-2 bg-card flex-1 min-h-18">
        {row.items.map((item: TierItem) => (
          <Card key={item.id} item={item} draggable onDragStart={(e) => onDragStart(e, item)} />
        ))}
      </div>
    </div>
  );
}
