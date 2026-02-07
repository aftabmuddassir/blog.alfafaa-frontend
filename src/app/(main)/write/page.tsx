"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useHydration } from "@/hooks";
import { ArticleEditor } from "@/components/editor";

export default function WritePage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  return <ArticleEditor />;
}
