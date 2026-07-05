"use client";

import { useMemo, useRef, useState } from "react";
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
  const [dragging, setDragging] = useState(false);

  const removeItem = (itemId: string) => {
    setPool((p) => p.filter((i) => i.id !== itemId));
    setRows((prev) =>
      prev.map((r) => ({ ...r, items: r.items.filter((i) => i.id !== itemId) })),
    );
  };

  const handleDragStart = (e: React.DragEvent, item: TierItem) => {
    e.dataTransfer.setData("text/plain", item.id);
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
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

  const handleRename = (rowId: string, newName: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, name: newName, label: newName } : r,
      ),
    );
  };

  const addToPool = (item: TierItem) => {
    setPool((prev) => [...prev, item]);
  };

  const labelWidth = useMemo(() => {
    const maxLen = Math.max(...rows.map((r) => r.label.length), 1);
    return maxLen * 11 + 32;
  }, [rows]);

  const handleDropOnRow = (e: React.DragEvent, rowId: string) => {
    e.preventDefault();
    setDragging(false);
    moveToRow(e.dataTransfer.getData("text/plain"), rowId);
  };

  /* Touch drag-and-drop */
  const dragItemId = useRef<string | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent, item: TierItem) => {
    dragItemId.current = item.id;
    setDragging(true);

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
    setDragging(false);
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

    const trashEl = target.closest("[data-trash-zone]");
    if (trashEl) {
      removeItem(id);
      return;
    }

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

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    moveToPool(e.dataTransfer.getData("text/plain"));
  };

  const handleDropOnTrash = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    removeItem(e.dataTransfer.getData("text/plain"));
  };

  return (
    <div
      className="flex flex-col lg:flex-row gap-4 items-start"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragEnd={handleDragEnd}
    >
      <div
        data-trash-zone
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-destructive bg-destructive/10 text-destructive text-sm font-medium backdrop-blur-sm transition-all duration-200 ${dragging ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnTrash}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Drop here to delete
      </div>

      <div id="tier-list" className="flex flex-col gap-2 flex-3 min-w-0 w-full">
        {rows.map((row) => (
          <Line
            key={row.id}
            row={row}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropOnRow(e, row.id)}
            onDragStart={(e, item) => handleDragStart(e, item)}
            onRename={handleRename}
            labelWidth={labelWidth}
            data-row-id={row.id}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-96 shrink-0">
        <ImageUpload onAddItem={addToPool} />

        <div
          data-drop-zone
          className="flex flex-wrap gap-2 p-4 rounded-xl border-2 border-dashed border-card-border bg-card min-h-20"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnPool}
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
