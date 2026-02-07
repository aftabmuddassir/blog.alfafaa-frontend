"use client";

import { use, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useHydration, useArticleById } from "@/hooks";
import { ArticleEditor } from "@/components/editor";
import { Skeleton } from "@/components/ui/skeleton";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHydration();
  const { isAuthenticated, user } = useAuthStore();
  const { data: article, isLoading, isError } = useArticleById(id);

  // Auth guard
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // Ownership check
  useEffect(() => {
    if (article && user && article.author.id !== user.id) {
      router.push("/");
    }
  }, [article, user, router]);

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  if (isError || !article) {
    notFound();
  }

  return <ArticleEditor article={article} />;
}

function EditPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
