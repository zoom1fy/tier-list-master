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
  labelWidth?: number;
  "data-row-id"?: string;
};

export function Line({ row, onDragOver, onDrop, onDragStart, onRename, labelWidth, ...rest }: LineProps) {
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
      className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-card-border"
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...rest}
    >
      <div
        className={`flex items-center justify-center min-h-18 ${row.backgroundColorClass} text-lg font-bold shrink-0 transition-[width] duration-200`}
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
      </div>
      <div className="flex flex-wrap gap-2 p-2 bg-card flex-1 min-h-18">
        {row.items.map((item: TierItem) => (
          <Card key={item.id} item={item} draggable onDragStart={(e) => onDragStart(e, item)} />
        ))}
      </div>
    </div>
  );
}
