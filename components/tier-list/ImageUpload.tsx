"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveBlob } from "@/lib/persistence";
import { nextId } from "@/lib/idCounter";
import type { TierItem } from "@/types/TierItem";

type ImageUploadProps = {
  onAddItem: (item: TierItem) => void;
};

export function ImageUpload({ onAddItem }: ImageUploadProps) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFile, setIsFile] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileBlobRef = useRef<Blob | null>(null);

  const validateImage = (src: string) => {
    const img = new window.Image();
    img.onload = () => {
      setError(null);
    };
    img.onerror = () => {
      setPreview(null);
      setError("Failed to load image. Check the URL or file.");
    };
    img.src = src;
  };

  const handleUrlLoad = () => {
    if (!url.trim()) return;
    setError(null);
    setPreview(url.trim());
    setName("");
    setIsFile(false);
    fileBlobRef.current = null;
    validateImage(url.trim());
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileBlobRef.current = file;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setName("");
      setError(null);
      setIsFile(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!preview) return;

    const id = nextId();
    let blobKey: string | undefined;

    if (isFile && fileBlobRef.current) {
      blobKey = `blob-${id}`;
      await saveBlob(blobKey, fileBlobRef.current);
      fileBlobRef.current = null;
    }

    onAddItem({
      id,
      name: name.trim(),
      imageUrl: preview,
      tier: "unassigned",
      blobKey,
    });
    setUrl("");
    setPreview(null);
    setName("");
    setError(null);
    setIsFile(false);
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

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

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
