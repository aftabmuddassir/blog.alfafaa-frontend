import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  subtitle: z
    .string()
    .max(300, "Subtitle must be less than 300 characters")
    .optional()
    .or(z.literal("")),
  content: z.string().min(1, "Article content is required"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be less than 300 characters")
    .optional()
    .or(z.literal("")),
  featured_image_url: z.string().url().optional().or(z.literal("")),
  category_ids: z.array(z.string()).optional(),
  tag_ids: z
    .array(z.string())
    .max(5, "Maximum 5 tags allowed")
    .optional(),
  status: z.enum(["draft", "published"]),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
