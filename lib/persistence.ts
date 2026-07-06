const DB_NAME = "tier-list-master";
const STORE_NAME = "blobs";
const STRUCTURE_KEY = "tier-list-structure";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function loadBlob(key: string): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => { db.close(); resolve(req.result ?? undefined); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deleteBlob(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function clearAllBlobs(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export interface SavedItem {
  id: string;
  name: string;
  imageUrl: string;
  tier: string;
  blobKey?: string;
}

export interface SavedRow {
  id: string;
  name: string;
  label: string;
  backgroundColorClass: string;
  items: SavedItem[];
}

export interface SavedState {
  pool: SavedItem[];
  rows: SavedRow[];
}

export function saveStructure(state: SavedState): void {
  try {
    localStorage.setItem(STRUCTURE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded */ }
}

export function loadStructure(): SavedState | null {
  try {
    const raw = localStorage.getItem(STRUCTURE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStructure(): void {
  localStorage.removeItem(STRUCTURE_KEY);
}

/* Export / Import */

export interface ExportPayload {
  version: 1;
  meta: { exportedAt: string };
  blobs: Record<string, string>;
  structure: SavedState;
}

export async function exportTierList(): Promise<ExportPayload> {
  const structure = loadStructure();
  if (!structure) throw new Error("Nothing to export");

  const blobs: Record<string, string> = {};

  const collectBlobs = async (items: SavedItem[]) => {
    for (const item of items) {
      if (!item.blobKey) continue;
      const blob = await loadBlob(item.blobKey);
      if (!blob) continue;
      const buf = await blob.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      blobs[item.blobKey] = btoa(binary);
    }
  };

  await collectBlobs(structure.pool);
  for (const row of structure.rows) {
    await collectBlobs(row.items);
  }

  return {
    version: 1,
    meta: { exportedAt: new Date().toISOString() },
    blobs,
    structure,
  };
}

export async function importTierList(payload: ExportPayload): Promise<void> {
  for (const [key, base64] of Object.entries(payload.blobs)) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes]);
    await saveBlob(key, blob);
  }
  saveStructure(payload.structure);
}
