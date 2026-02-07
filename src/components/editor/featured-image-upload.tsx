"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaUpload } from "@/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeaturedImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
}

export function FeaturedImageUpload({
  value,
  onChange,
}: FeaturedImageUploadProps) {
  const uploadMutation = useMediaUpload();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      try {
        const media = await uploadMutation.mutateAsync({ file });
        onChange(media.url);
      } catch {
        toast.error("Failed to upload image");
      }
    },
    [uploadMutation, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
      // Reset input so the same file can be selected again
      e.target.value = "";
    },
    [handleUpload]
  );

  if (value) {
    return (
      <div className="relative group rounded-lg overflow-hidden aspect-video bg-muted">
        <Image
          src={value}
          alt="Featured image"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onChange(undefined)}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed aspect-video cursor-pointer transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      {uploadMutation.isPending ? (
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      ) : (
        <>
          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            Click or drag to upload
          </span>
        </>
      )}
    </label>
  );
}
