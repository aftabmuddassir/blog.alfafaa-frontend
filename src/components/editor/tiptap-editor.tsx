"use client";

import { EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

// Shared extensions configuration - used by useEditor() in the parent component
export const editorExtensions = [
  StarterKit.configure({
    codeBlock: false, // Replaced by CodeBlockLowlight
    heading: {
      levels: [2, 3], // H1 is the title input above the editor
    },
  }),
  Image.configure({
    inline: false,
    allowBase64: false,
    HTMLAttributes: {
      class: "rounded-lg mx-auto my-6 max-w-full",
    },
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      class: "text-primary underline underline-offset-4 hover:text-primary/80",
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class:
        "rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto my-4",
    },
  }),
  Placeholder.configure({
    placeholder: "Tell your story...",
    emptyEditorClass: "is-editor-empty",
  }),
];

interface TiptapEditorProps {
  editor: Editor | null;
}

export function TiptapEditor({ editor }: TiptapEditorProps) {
  if (!editor) return null;

  return (
    <div className="min-h-[50vh] pb-24">
      <EditorContent editor={editor} />
    </div>
  );
}
