import { useState, useEffect } from "react";
import { getApiBase } from "./config";

export function useCMSContent<T>(section: string, defaultContent: T): T {
  const [content, setContent] = useState<T>(defaultContent);

  useEffect(() => {
    // 1. Load from localStorage first (for instant preview / offline / local fallback)
    const local = localStorage.getItem(`cms_${section}`);
    if (local) {
      try {
        setContent(JSON.parse(local));
      } catch (e) {
        console.error(`Error parsing cached CMS section: ${section}`, e);
      }
    }

    // 2. Fetch from Go Backend API
    let active = true;
    async function fetchContent() {
      try {
        const res = await fetch(`${getApiBase()}/site-content/${section}`);
        if (!res.ok) {
          throw new Error(`Section not found or server error: ${res.status}`);
        }
        const resJson = await res.json();
        const payload = resJson.data || resJson;
        if (payload && active) {
          setContent(payload);
          localStorage.setItem(`cms_${section}`, JSON.stringify(payload));
        }
      } catch (err) {
        // Safe to ignore, fall back to localStorage/default
        console.warn(`Failed to fetch dynamic CMS section: ${section}. Using local fallback.`, err);
      }
    }

    fetchContent();

    return () => {
      active = false;
    };
  }, [section]);

  return content;
}
