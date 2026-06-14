"use client";

import { useState } from "react";
import { putPhoto, deletePhoto } from "@/lib/idb";
import { Photo } from "./Photo";

/** Read a File, downscale it on a canvas, return a JPEG data URL. */
async function fileToResizedDataUrl(
  file: File,
  max = 1280,
  quality = 0.8
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("이미지를 불러오지 못했어요"));
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (width > max || height > max) {
    const ratio = Math.min(max / width, max / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function PhotoUploader({
  photoIds,
  onChange,
  max = 10,
}: {
  photoIds: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file
    if (files.length === 0) return;

    setBusy(true);
    try {
      const room = Math.max(0, max - photoIds.length);
      const added: string[] = [];
      for (const f of files.slice(0, room)) {
        if (!f.type.startsWith("image/")) continue;
        const url = await fileToResizedDataUrl(f);
        const id = crypto.randomUUID();
        await putPhoto(id, url);
        added.push(id);
      }
      if (added.length) onChange([...photoIds, ...added]);
    } catch {
      alert("사진 업로드에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function removeOne(id: string) {
    await deletePhoto(id).catch(() => {});
    onChange(photoIds.filter((x) => x !== id));
  }

  const full = photoIds.length >= max;

  return (
    <div className="flex flex-wrap gap-2">
      <label
        className={`flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-xs ${
          full ? "cursor-not-allowed border-gray-200 text-gray-300" : "border-gray-300 text-gray-500"
        }`}
      >
        <span className="text-xl">📷</span>
        <span>
          {busy ? "올리는 중" : `${photoIds.length}/${max}`}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy || full}
          onChange={onFiles}
        />
      </label>

      {photoIds.map((id, idx) => (
        <div key={id} className="relative h-20 w-20 overflow-hidden rounded-lg border">
          <Photo id={id} className="h-20 w-20 object-cover" alt={`사진 ${idx + 1}`} />
          {idx === 0 && (
            <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] text-white">
              대표
            </span>
          )}
          <button
            type="button"
            onClick={() => removeOne(id)}
            className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            aria-label="사진 삭제"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
