"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./Card";
import { Line } from "./Line";
import { ImageUpload } from "./ImageUpload";
import {
  deleteBlob,
  loadBlob,
  loadStructure,
  saveStructure,
} from "@/lib/persistence";
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

async function restoreState(urls: Set<string>): Promise<{ rows: TierRow[]; pool: TierItem[] }> {
  const saved = loadStructure();
  if (!saved) return { rows: defaultRows, pool: [] };

  const restoreItem = async (item: TierItem): Promise<TierItem> => {
    if (!item.blobKey) return item;
    const blob = await loadBlob(item.blobKey);
    if (!blob) return { ...item, blobKey: undefined };
    const url = URL.createObjectURL(blob);
    urls.add(url);
    return { ...item, imageUrl: url };
  };

  const pool: TierItem[] = await Promise.all(saved.pool.map(restoreItem));
  const rows: TierRow[] = await Promise.all(
    saved.rows.map(async (r) => ({
      ...r,
      items: await Promise.all(r.items.map(restoreItem)),
    })),
  );

  return { rows, pool };
}

const SAVE_DEBOUNCE = 500;

export function Workflow() {
  const [rows, setRows] = useState<TierRow[]>(defaultRows);
  const [pool, setPool] = useState<TierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const objectUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    restoreState(objectUrls.current).then((state) => {
      setRows(state.rows);
      setPool(state.pool);
      setLoading(false);
    });
    return () => {
      clearTimeout(saveTimer.current);
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrls.current.clear();
    };
  }, []);

  const persist = () => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setRows((currentRows) => {
        setPool((currentPool) => {
          saveStructure({
            pool: currentPool.map(({ id, name, imageUrl, tier, blobKey }) => ({
              id, name, imageUrl, tier, blobKey,
            })),
            rows: currentRows.map((r) => ({
              ...r,
              items: r.items.map(({ id, name, imageUrl, tier, blobKey }) => ({
                id, name, imageUrl, tier, blobKey,
              })),
            })),
          });
          return currentPool;
        });
        return currentRows;
      });
    }, SAVE_DEBOUNCE);
  };

  const removeItem = async (itemId: string) => {
    let blobKey: string | undefined;
    let imageUrl: string | undefined;

    setPool((p) => {
      const item = p.find((i) => i.id === itemId);
      if (item) {
        blobKey = item.blobKey;
        imageUrl = item.imageUrl;
      }
      return p.filter((i) => i.id !== itemId);
    });
    setRows((prev) => {
      for (const row of prev) {
        const item = row.items.find((i) => i.id === itemId);
        if (item) {
          blobKey = item.blobKey;
          imageUrl = item.imageUrl;
          break;
        }
      }
      return prev.map((r) => ({ ...r, items: r.items.filter((i) => i.id !== itemId) }));
    });

    if (imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
      objectUrls.current.delete(imageUrl);
    }
    if (blobKey) {
      await deleteBlob(blobKey);
    }
    persist();
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
    persist();
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
    persist();
  };

  const handleRename = (rowId: string, newName: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, name: newName, label: newName } : r,
      ),
    );
    persist();
  };

  const addToPool = (item: TierItem) => {
    setPool((prev) => [...prev, item]);
    persist();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Restoring your tier list...
      </div>
    );
  }

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

      <div className="flex flex-col gap-3 w-full lg:w-120 shrink-0">
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
