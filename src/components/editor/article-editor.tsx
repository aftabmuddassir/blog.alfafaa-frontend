"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor } from "@tiptap/react";
import { Eye, PenSquare, Loader2, CloudOff, Check, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Article } from "@/types";
import { useAutoSave, useMediaUpload, useCreateArticle, useUpdateArticle } from "@/hooks";
import type { AutoSaveStatus } from "@/hooks";

import { editorExtensions } from "./tiptap-editor";
import { TiptapEditor } from "./tiptap-editor";
import { EditorToolbar } from "./editor-toolbar";
import { EditorPreview } from "./editor-preview";
import { PublishDialog, type PublishMetadata } from "./publish-dialog";

interface ArticleEditorProps {
  article?: Article;
}

export function ArticleEditor({ article }: ArticleEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);

  // Local state
  const [title, setTitle] = useState(article?.title || "");
  const [subtitle, setSubtitle] = useState(article?.subtitle || "");
  const [content, setContent] = useState(article?.content || "");
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  // Mutations
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const uploadMutation = useMediaUpload();

  // Tiptap editor
  const editor = useEditor({
    extensions: editorExtensions,
    content: article?.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-article prose prose-lg dark:prose-invert max-w-none min-h-[400px] focus:outline-none px-0",
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageFile(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) handleImageFile(file);
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: e }) => {
      setContent(e.getHTML());
    },
  });

  // Auto-save
  const autoSave = useAutoSave({
    data: { title, subtitle, content },
    articleId: article?.id,
    enabled: !isPublishDialogOpen,
  });

  // Auto-resize textareas
  const adjustHeight = useCallback((el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  useEffect(() => adjustHeight(titleRef.current), [title, adjustHeight]);
  useEffect(() => adjustHeight(subtitleRef.current), [subtitle, adjustHeight]);

  // Image upload handler
  const handleImageFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const toastId = toast.loading("Uploading image...");

      try {
        const media = await uploadMutation.mutateAsync({ file });
        editor
          ?.chain()
          .focus()
          .setImage({ src: media.url, alt: media.alt_text || "" })
          .run();
        toast.dismiss(toastId);
        toast.success("Image uploaded");
      } catch {
        toast.dismiss(toastId);
        toast.error("Failed to upload image");
      }
    },
    [editor, uploadMutation]
  );

  const handleImageUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageFile(file);
      e.target.value = "";
    },
    [handleImageFile]
  );

  // Publish handler
  const handlePublish = useCallback(
    async (metadata: PublishMetadata) => {
      if (!title.trim()) {
        toast.error("Please add a title");
        return;
      }

      const articleData = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        content,
        excerpt: metadata.excerpt,
        featured_image_url: metadata.featured_image_url,
        category_ids: metadata.category_ids || [],
        tag_ids: metadata.tag_ids || [],
        status: "published" as const,
      };

      try {
        let result: Article;
        const existingId = article?.id || autoSave.articleId;

        if (existingId) {
          result = await updateMutation.mutateAsync({
            id: existingId,
            ...articleData,
          });
        } else {
          result = await createMutation.mutateAsync(articleData);
        }

        toast.success("Article published!");
        router.push(`/article/${result.slug}`);
      } catch {
        toast.error("Failed to publish article");
      }
    },
    [title, subtitle, content, article?.id, autoSave.articleId, createMutation, updateMutation, router]
  );

  // Save as draft handler
  const handleSaveDraft = useCallback(
    async (metadata: PublishMetadata) => {
      const articleData = {
        title: title.trim() || "Untitled",
        subtitle: subtitle.trim() || undefined,
        content,
        excerpt: metadata.excerpt,
        featured_image_url: metadata.featured_image_url,
        category_ids: metadata.category_ids || [],
        tag_ids: metadata.tag_ids || [],
        status: "draft" as const,
      };

      try {
        const existingId = article?.id || autoSave.articleId;

        if (existingId) {
          await updateMutation.mutateAsync({
            id: existingId,
            ...articleData,
          });
        } else {
          await createMutation.mutateAsync(articleData);
        }

        toast.success("Draft saved!");
        setIsPublishDialogOpen(false);
      } catch {
        toast.error("Failed to save draft");
      }
    },
    [title, subtitle, content, article?.id, autoSave.articleId, createMutation, updateMutation]
  );

  // Word count
  const wordCount =
    editor?.state.doc.textContent.split(/\s+/).filter(Boolean).length || 0;

  // Content preview for auto-excerpt
  const contentPreview =
    editor?.state.doc.textContent.slice(0, 160).trim() || "";

  // Initial data for publish dialog
  const publishInitialData: PublishMetadata = {
    category_ids: article?.categories?.[0]?.id ? [article.categories[0].id] : [],
    tag_ids: article?.tags?.map((t) => t.id) || [],
    excerpt: article?.excerpt,
    featured_image_url: article?.featured_image_url,
  };

  if (!editor) {
    return <EditorSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Title */}
      <textarea
        ref={titleRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-3xl sm:text-4xl font-bold tracking-tight resize-none border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 mb-2"
        rows={1}
      />

      {/* Subtitle */}
      <textarea
        ref={subtitleRef}
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Subtitle (optional)"
        className="w-full text-lg sm:text-xl text-muted-foreground resize-none border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 mb-6"
        rows={1}
      />

      {/* Toolbar */}
      <EditorToolbar editor={editor} onImageUpload={handleImageUploadClick} />

      {/* Editor / Preview */}
      <div className="mt-6">
        {isPreview ? (
          <EditorPreview content={content} />
        ) : (
          <TiptapEditor editor={editor} />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t py-2 px-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <AutoSaveIndicator status={autoSave.status} />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? (
                <PenSquare className="h-4 w-4 mr-1.5" />
              ) : (
                <Eye className="h-4 w-4 mr-1.5" />
              )}
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsPublishDialogOpen(true)}
              disabled={!title.trim()}
            >
              {article ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Publish Dialog */}
      <PublishDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        isPublishing={createMutation.isPending || updateMutation.isPending}
        initialData={publishInitialData}
        contentPreview={contentPreview}
        isEditMode={!!article}
      />
    </div>
  );
}

function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  switch (status) {
    case "saving":
      return (
        <span className="flex items-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving...
        </span>
      );
    case "saved":
      return (
        <span className="flex items-center gap-1.5 text-green-600">
          <Check className="h-3.5 w-3.5" />
          Saved
        </span>
      );
    case "error":
      return (
        <span className="flex items-center gap-1.5 text-destructive">
          <CloudOff className="h-3.5 w-3.5" />
          Save failed
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5">
          <Cloud className="h-3.5 w-3.5" />
          Draft
        </span>
      );
  }
}

function EditorSkeleton() {
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
