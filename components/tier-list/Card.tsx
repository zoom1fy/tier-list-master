"use client";

import Image from "next/image";
import type { TierItem } from "@/types/TierItem";

type CardProps = {
  item: TierItem;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onTouchStart?: (e: React.TouchEvent, item: TierItem) => void;
};

export function Card({ item, draggable = false, onDragStart, onTouchStart }: CardProps) {
  const { name, imageUrl } = item;

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onTouchStart={onTouchStart ? (e) => onTouchStart(e, item) : undefined}
      className="w-24 rounded-lg bg-card border border-card-border cursor-grab active:cursor-grabbing hover:shadow-sm transition-all overflow-hidden"
    >
      {imageUrl && (
        <div className="aspect-square w-full overflow-hidden">
          <Image src={imageUrl} alt={name} width={96} height={96} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-1.5 py-1 text-xs text-center text-foreground truncate">
        {name.slice(0, 30)}
      </div>
    </div>
  );
}
