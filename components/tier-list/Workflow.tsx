"use client";

import { useRef, useState } from "react";
import { Card } from "./Card";
import { Line } from "./Line";
import { ImageUpload } from "./ImageUpload";
import type { TierRow } from "@/types/TierRow";
import type { TierItem } from "@/types/TierItem";

const defaultRows: TierRow[] = [
  { id: "s", name: "S", label: "S", backgroundColorClass: "tier-s", items: [] },
  { id: "a", name: "A", label: "A", backgroundColorClass: "tier-a", items: [] },
  { id: "b", name: "B", label: "B", backgroundColorClass: "tier-b", items: [] },
  { id: "c", name: "C", label: "C", backgroundColorClass: "tier-c", items: [] },
  { id: "d", name: "D", label: "D", backgroundColorClass: "tier-d", items: [] },
  { id: "f", name: "F", label: "F", backgroundColorClass: "tier-f", items: [] },
];

const initialPool: TierItem[] = [];

export function Workflow() {
  const [rows, setRows] = useState<TierRow[]>(defaultRows);
  const [pool, setPool] = useState<TierItem[]>(initialPool);

  const handleDragStart = (e: React.DragEvent, item: TierItem) => {
    e.dataTransfer.setData("text/plain", item.id);
  };

  const moveToRow = (itemId: string, rowId: string) => {
    const allItems = [
      ...pool,
      ...rows.flatMap((r) => r.items),
    ];
    const dragged = allItems.find((i) => i.id === itemId);
    if (!dragged) return;

    setPool((p) => p.filter((i) => i.id !== itemId));
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        items:
          r.id === rowId
            ? [...r.items.filter((i) => i.id !== itemId), { ...dragged, tier: r.name } as TierItem]
            : r.items.filter((i) => i.id !== itemId),
      })),
    );
  };

  const moveToPool = (itemId: string) => {
    const allItems = [
      ...pool,
      ...rows.flatMap((r) => r.items),
    ];
    const dragged = allItems.find((i) => i.id === itemId);
    if (!dragged) return;

    setPool((p) => [...p.filter((i) => i.id !== itemId), { ...dragged, tier: "unassigned" } as TierItem]);
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        items: r.items.filter((i) => i.id !== itemId),
      })),
    );
  };

  const addToPool = (item: TierItem) => {
    setPool((prev) => [...prev, item]);
  };

  const handleDropOnRow = (e: React.DragEvent, rowId: string) => {
    e.preventDefault();
    moveToRow(e.dataTransfer.getData("text/plain"), rowId);
  };

  /* Touch drag-and-drop */
  const dragItemId = useRef<string | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent, item: TierItem) => {
    dragItemId.current = item.id;

    const touch = e.touches[0];
    const ghost = document.createElement("div");
    ghost.className = "w-24 rounded-lg bg-card border border-card-border overflow-hidden shadow-xl opacity-80 fixed pointer-events-none z-50";
    ghost.style.left = `${touch.clientX - 48}px`;
    ghost.style.top = `${touch.clientY - 48}px`;
    ghost.innerHTML = `<div class="aspect-square w-full overflow-hidden"><img src="${item.imageUrl}" alt="" class="w-full h-full object-cover" /></div><div class="px-1.5 py-1 text-xs text-center text-foreground truncate">${item.name.slice(0, 30)}</div>`;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!ghostRef.current) return;
    const touch = e.touches[0];
    ghostRef.current.style.left = `${touch.clientX - 48}px`;
    ghostRef.current.style.top = `${touch.clientY - 48}px`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }

    const id = dragItemId.current;
    dragItemId.current = null;
    if (!id) return;

    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target) return;

    const rowEl = target.closest("[data-row-id]");
    if (rowEl) {
      const rowId = rowEl.getAttribute("data-row-id");
      if (rowId) moveToRow(id, rowId);
      return;
    }

    const poolEl = target.closest("[data-drop-zone]");
    if (poolEl) {
      moveToPool(id);
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row gap-4 items-start"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col gap-2 flex-3 min-w-0 w-full">
        {rows.map((row) => (
          <Line
            key={row.id}
            row={row}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropOnRow(e, row.id)}
            onDragStart={(e, item) => handleDragStart(e, item)}
            data-row-id={row.id}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-96 shrink-0">
        <ImageUpload onAddItem={addToPool} />

        <div
          data-drop-zone
          className="flex flex-wrap gap-2 p-4 rounded-xl border-2 border-dashed border-card-border bg-card min-h-[80px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            moveToPool(e.dataTransfer.getData("text/plain"));
          }}
        >
          <span className="text-xs text-muted-foreground w-full">
            Unassigned ({pool.length})
          </span>
          {pool.length === 0 && (
            <span className="text-sm text-muted-foreground">Add images above or drag items here from tiers</span>
          )}
          {pool.map((item) => (
            <Card key={item.id} item={item} draggable onDragStart={(e) => handleDragStart(e, item)} onTouchStart={handleTouchStart} />
          ))}
        </div>
      </div>
    </div>
  );
}
