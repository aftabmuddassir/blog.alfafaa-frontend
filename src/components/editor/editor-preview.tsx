"use client";

interface EditorPreviewProps {
  content: string;
}

export function EditorPreview({ content }: EditorPreviewProps) {
  return (
    <div className="min-h-[50vh] pb-24 border rounded-lg p-8 bg-muted/20">
      <div className="text-sm text-muted-foreground mb-4 font-sans">
        Preview
      </div>
      <div
        className="prose-article prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
