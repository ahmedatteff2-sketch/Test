"use client";

import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProgressPhoto {
  id: number;
  url: string;
  addedAt: string;
}

export default function PhotosPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const counter = useRef(0);

  // Keep a ref in sync with the latest photos so the unmount cleanup revokes the
  // URLs that actually exist at teardown. With [] deps the cleanup would close
  // over the initial (empty) photos and leak every URL created in the session.
  const photosRef = useRef<ProgressPhoto[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Revoke any remaining object URLs on unmount to avoid memory leaks.
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: ProgressPhoto[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: ++counter.current,
        url: URL.createObjectURL(f),
        addedAt: new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long" }),
      }));
    setPhotos((prev) => [...next, ...prev]);
  }

  function removePhoto(id: number) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-text-1">صور التقدم</h1>
        <Button size="sm" onClick={() => inputRef.current?.click()}>
          + إضافة صورة
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="رفع صور التقدم"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {photos.length === 0 ? (
        <Card>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full text-center py-12 cursor-pointer rounded-[var(--radius-md)] transition-colors hover:bg-surface-high/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <div className="w-16 h-16 rounded-full bg-surface-high mx-auto mb-4 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" aria-hidden="true">
                <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <p className="text-text-2 text-sm">ارفع صورتك الأسبوعية لمتابعة تطورك</p>
            <p className="text-text-3 text-xs mt-1">أمامي، جانبي، خلفي</p>
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="p-0 overflow-hidden group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`صورة تقدم — ${photo.addedAt}`}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-semibold text-text-2">{photo.addedAt}</span>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label="حذف الصورة"
                  className="text-text-3 transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 rounded"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
