"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FeaturedImageUpload } from "./featured-image-upload";
import { useCategories, usePopularTags } from "@/hooks";
import { cn } from "@/lib/utils";

export interface PublishMetadata {
  category_ids?: string[];
  tag_ids?: string[];
  excerpt?: string;
  featured_image_url?: string;
}

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (metadata: PublishMetadata) => void;
  onSaveDraft: (metadata: PublishMetadata) => void;
  isPublishing: boolean;
  initialData?: PublishMetadata;
  contentPreview?: string; // First ~160 chars of content for auto-excerpt
  isEditMode?: boolean;
}

export function PublishDialog({
  open,
  onOpenChange,
  onPublish,
  onSaveDraft,
  isPublishing,
  initialData,
  contentPreview,
  isEditMode = false,
}: PublishDialogProps) {
  const { data: categories } = useCategories();
  const { data: popularTags } = usePopularTags(20);

  const [categoryId, setCategoryId] = useState(
    initialData?.category_ids?.[0] || ""
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tag_ids || []
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(
    initialData?.featured_image_url
  );

  // Reset state when dialog opens with new initial data
  useEffect(() => {
    if (open && initialData) {
      setCategoryId(initialData.category_ids?.[0] || "");
      setSelectedTagIds(initialData.tag_ids || []);
      setExcerpt(initialData.excerpt || "");
      setFeaturedImage(initialData.featured_image_url);
    }
  }, [open, initialData]);

  // Auto-populate excerpt from content if empty
  useEffect(() => {
    if (open && !excerpt && contentPreview) {
      setExcerpt(contentPreview);
    }
  }, [open, excerpt, contentPreview]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      if (prev.length >= 5) return prev;
      return [...prev, tagId];
    });
  };

  const getMetadata = (): PublishMetadata => ({
    category_ids: categoryId ? [categoryId] : [],
    tag_ids: selectedTagIds.length > 0 ? selectedTagIds : [],
    excerpt: excerpt || undefined,
    featured_image_url: featuredImage,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update your story" : "Publish your story"}
          </DialogTitle>
          <DialogDescription>
            Add details to help readers find your story
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Featured image</Label>
              <FeaturedImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="excerpt">Preview subtitle</Label>
                <span className="text-xs text-muted-foreground">
                  {excerpt.length}/300
                </span>
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
                placeholder="Write a brief description..."
                className="resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category
              </Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">None</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Tags</Label>
                <span className="text-xs text-muted-foreground">
                  {selectedTagIds.length}/5
                </span>
              </div>

              {/* Selected tags */}
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedTagIds.map((tagId) => {
                    const tag = popularTags?.find((t) => t.id === tagId);
                    return (
                      <Badge
                        key={tagId}
                        variant="secondary"
                        className="cursor-pointer gap-1"
                        onClick={() => toggleTag(tagId)}
                      >
                        {tag?.name || tagId}
                        <X className="h-3 w-3" />
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Available tags */}
              <div className="flex flex-wrap gap-1.5">
                {popularTags
                  ?.filter((tag) => !selectedTagIds.includes(tag.id))
                  .map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedTagIds.length >= 5
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted"
                      )}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
              </div>
              {!popularTags?.length && (
                <p className="text-sm text-muted-foreground">
                  No tags available yet
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSaveDraft(getMetadata())}
            disabled={isPublishing}
          >
            Save as draft
          </Button>
          <Button
            type="button"
            onClick={() => onPublish(getMetadata())}
            disabled={isPublishing}
          >
            {isPublishing && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditMode ? "Update" : "Publish now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
