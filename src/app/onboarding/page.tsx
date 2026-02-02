"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useSaveInterests, useHydration } from "@/hooks";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

// Category color mapping
const categoryColors: Record<string, string> = {
  technology: "bg-[#DBEAFE] hover:bg-[#BFDBFE] border-[#DBEAFE]",
  programming: "bg-[#D1FAE5] hover:bg-[#A7F3D0] border-[#D1FAE5]",
  wellness: "bg-[#FCE7F3] hover:bg-[#FBCFE8] border-[#FCE7F3]",
  lifestyle: "bg-[#FCE7F3] hover:bg-[#FBCFE8] border-[#FCE7F3]",
  islam: "bg-[#CCFBF1] hover:bg-[#99F6E4] border-[#CCFBF1]",
  deen: "bg-[#CCFBF1] hover:bg-[#99F6E4] border-[#CCFBF1]",
  news: "bg-[#FEF3C7] hover:bg-[#FDE68A] border-[#FEF3C7]",
  science: "bg-[#EDE9FE] hover:bg-[#DDD6FE] border-[#EDE9FE]",
  business: "bg-[#FEE2E2] hover:bg-[#FECACA] border-[#FEE2E2]",
  health: "bg-[#D1FAE5] hover:bg-[#A7F3D0] border-[#D1FAE5]",
  default: "bg-slate-100 hover:bg-slate-200 border-slate-100",
};

function getCategoryColor(categoryName: string): string {
  const normalizedName = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(categoryColors)) {
    if (normalizedName.includes(key)) {
      return value;
    }
  }
  return categoryColors.default;
}

export default function OnboardingPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { isAuthenticated } = useAuthStore();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories(true);
  const saveInterestsMutation = useSaveInterests();

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  // Redirect if not authenticated (only after hydration)
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, hydrated, router]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleContinue = async () => {
    if (selectedCategories.size < 3) {
      toast.error("Please select at least 3 topics");
      return;
    }

    try {
      await saveInterestsMutation.mutateAsync(Array.from(selectedCategories));
      toast.success("Preferences saved!");
      router.push("/");
    } catch {
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  const canContinue = selectedCategories.size >= 3;

  // Show skeleton until hydrated and categories loaded
  if (!hydrated || isCategoriesLoading) {
    return <OnboardingSkeleton />;
  }

  // Flatten categories for display
  const allCategories: Category[] = [];
  const processCategories = (cats: Category[]) => {
    for (const cat of cats) {
      allCategories.push(cat);
      if (cat.children && cat.children.length > 0) {
        processCategories(cat.children);
      }
    }
  };
  if (categories) {
    processCategories(categories);
  }

  // Group categories by parent or standalone
  const parentCategories = categories?.filter((c) => !c.parent_id) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Alfafaa</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
            What would you like to read?
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Choose 3 or more topics to personalize your feed
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-full transition-colors",
              canContinue
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {selectedCategories.size} selected
            {!canContinue && ` (${3 - selectedCategories.size} more needed)`}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {parentCategories.map((parentCategory) => (
            <div key={parentCategory.id}>
              <h2 className="text-lg font-semibold mb-4">
                {parentCategory.name}
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {/* Include parent category itself */}
                <TopicPill
                  category={parentCategory}
                  isSelected={selectedCategories.has(parentCategory.id)}
                  onClick={() => toggleCategory(parentCategory.id)}
                />
                {/* Include children */}
                {parentCategory.children?.map((child) => (
                  <TopicPill
                    key={child.id}
                    category={child}
                    isSelected={selectedCategories.has(child.id)}
                    onClick={() => toggleCategory(child.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* If no hierarchical categories, show flat list */}
          {parentCategories.length === 0 && allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {allCategories.map((category) => (
                <TopicPill
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.has(category.id)}
                  onClick={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t sm:static sm:bg-transparent sm:border-0 sm:mt-12 sm:p-0">
          <div className="w-full max-w-4xl mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!canContinue || saveInterestsMutation.isPending}
              className="w-full sm:w-auto sm:min-w-[200px] sm:mx-auto sm:flex h-12"
              size="lg"
            >
              {saveInterestsMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </div>

        {/* Spacer for fixed button on mobile */}
        <div className="h-20 sm:h-0" />
      </main>
    </div>
  );
}

interface TopicPillProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

function TopicPill({ category, isSelected, onClick }: TopicPillProps) {
  const colorClass = getCategoryColor(category.name);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
        "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected
          ? `${colorClass} border-primary scale-105`
          : `bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700`
      )}
    >
      <span className={cn(isSelected && "mr-5")}>{category.name}</span>
      {isSelected && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <Check className="h-4 w-4 text-primary" />
        </span>
      )}
    </button>
  );
}

function OnboardingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-20 h-6" />
          </div>
          <Skeleton className="w-24 h-9" />
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <Skeleton className="h-10 w-80 mx-auto mb-3" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        <div className="flex justify-center mb-8">
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>

        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-10 w-24 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
