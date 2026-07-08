"use client";

import { useRef, useState } from "react";
import { Card } from "./Card";
import type { TierRow } from "@/types/TierRow";
import type { TierItem } from "@/types/TierItem";

type LineProps = {
  row: TierRow;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, item: TierItem) => void;
  onRename?: (rowId: string, newName: string) => void;
  onRemove?: (rowId: string) => void;
  isRemoving?: boolean;
  labelWidth?: number;
  "data-row-id"?: string;
};

export function Line({ row, onDragOver, onDrop, onDragStart, onRename, onRemove, isRemoving, labelWidth, ...rest }: LineProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(row.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditValue(row.label);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== row.label) {
      onRename?.(row.id, trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div
      className={`fade-in ${isRemoving ? "fade-out" : ""} flex items-stretch gap-0 rounded-xl overflow-hidden border border-card-border`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...rest}
    >
      <div
          className={`relative group flex items-center justify-center min-h-18 ${row.backgroundColorClass} text-lg font-bold shrink-0 transition-[width] duration-200`}
          style={{ width: labelWidth || 64 }}
        >
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value.slice(0, 15))}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-center text-lg font-bold outline-none border-b border-current"
            maxLength={15}
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none text-inherit text-lg font-bold"
          >
            {row.label}
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(row.id)}
            className="absolute top-0.5 right-0.5 text-xs leading-none opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity bg-black/20 rounded-full size-4 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 p-2 bg-card flex-1 min-h-18">
        {row.items.map((item: TierItem) => (
          <Card key={item.id} item={item} draggable onDragStart={(e) => onDragStart(e, item)} />
        ))}
      </div>
    </div>
  );
}
