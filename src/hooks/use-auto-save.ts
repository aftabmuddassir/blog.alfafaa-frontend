import { useCallback, useEffect, useRef, useState } from "react";
import { articlesApi } from "@/lib/api";
import { Article } from "@/types";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface AutoSaveData {
  title: string;
  subtitle: string;
  content: string;
}

interface UseAutoSaveOptions {
  data: AutoSaveData;
  articleId?: string;
  delay?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
  articleId: string | null;
  save: () => Promise<void>;
}

// Strip HTML tags to get plain text for emptiness checks
function getTextContent(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function hasRealContent(data: AutoSaveData): boolean {
  return data.title.trim() !== "" || getTextContent(data.content) !== "";
}

export function useAutoSave({
  data,
  articleId: initialArticleId,
  delay = 3000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [articleId, setArticleId] = useState<string | null>(
    initialArticleId || null
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const lastDataRef = useRef<string>("");
  const dataRef = useRef(data);
  const hasMountedRef = useRef(false);
  dataRef.current = data;

  const performSave = useCallback(async () => {
    if (savingRef.current) return;

    const currentData = dataRef.current;

    // Don't save empty articles (strip HTML to check for real text)
    if (!hasRealContent(currentData)) return;

    const dataSnapshot = JSON.stringify(currentData);
    if (dataSnapshot === lastDataRef.current) return;

    savingRef.current = true;
    setStatus("saving");

    try {
      let result: Article;
      if (articleId) {
        result = await articlesApi.update({
          id: articleId,
          title: currentData.title,
          subtitle: currentData.subtitle || undefined,
          content: currentData.content,
          status: "draft",
        });
      } else {
        result = await articlesApi.create({
          title: currentData.title || "Untitled",
          subtitle: currentData.subtitle || undefined,
          content: currentData.content,
          category_ids: [],
          tag_ids: [],
          status: "draft",
        });
        setArticleId(result.id);
      }

      lastDataRef.current = dataSnapshot;
      setLastSavedAt(new Date());
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      savingRef.current = false;
    }
  }, [articleId]);

  // Debounced auto-save on data changes
  useEffect(() => {
    if (!enabled) return;

    // Skip the initial mount — don't auto-save before the user types anything
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      lastDataRef.current = JSON.stringify(data);
      return;
    }

    const dataSnapshot = JSON.stringify(data);
    if (dataSnapshot === lastDataRef.current) return;

    // Don't auto-save if there's no real text content
    if (!hasRealContent(data)) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      performSave();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, delay, enabled, performSave]);

  // Warn about unsaved changes before leaving
  useEffect(() => {
    const dataSnapshot = JSON.stringify(data);
    const hasUnsavedChanges =
      dataSnapshot !== lastDataRef.current && hasRealContent(data);

    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [data]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const save = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    await performSave();
  }, [performSave]);

  return { status, lastSavedAt, articleId, save };
}
