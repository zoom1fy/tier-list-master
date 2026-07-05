"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TierItem } from "@/types/TierItem";

type ImageUploadProps = {
  onAddItem: (item: TierItem) => void;
};

let nextId = 100;

export function ImageUpload({ onAddItem }: ImageUploadProps) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setName("");
    };
    reader.readAsDataURL(file);
  };

  const handleUrlLoad = () => {
    if (!url.trim()) return;
    setPreview(url.trim());
    setName((prev) => prev || url.split("/").pop()?.split(".")[0] || "Image");
  };

  const handleAdd = () => {
    if (!preview) return;
    onAddItem({
      id: String(nextId++),
      name: name.trim(),
      imageUrl: preview,
      tier: "unassigned",
    });
    setUrl("");
    setPreview(null);
    setName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-card-border bg-card/50 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Image URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button type="button" onClick={handleUrlLoad}>
            Load
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1 h-px bg-card-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-card-border" />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          id="file-upload"
        />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          Choose image
        </Button>

        {preview && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-card-border">
            <div className="w-10 h-10 rounded overflow-hidden shrink-0">
              <Image src={preview} alt="" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <Input
              type="text"
              placeholder="Enter name"
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="button" onClick={handleAdd}>
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
