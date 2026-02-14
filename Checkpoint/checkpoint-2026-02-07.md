# Checkpoint - 2026-02-07

## Previous Checkpoints
- [checkpoint-2026-02-01.md](checkpoint-2026-02-01.md) — Phase 1 (Foundation) + Phase 2 (Core Reading Experience)
- [checkpoint-2026-02-02.md](checkpoint-2026-02-02.md) — Google OAuth & Onboarding Fixes

## What Was Done This Session

### Fix: Login/Onboarding Redirect to Home Feed
1. ✅ Fixed routing conflict — both `app/page.tsx` (landing) and `app/(main)/page.tsx` (feed) resolved to `/`, with the landing page always winning
2. ✅ Extracted landing page into reusable component (`src/components/landing/landing-page.tsx`)
3. ✅ Extracted home feed (tabs + infinite scroll) into reusable component (`src/components/home/home-feed.tsx`)
4. ✅ Rewrote `src/app/page.tsx` as auth-aware router:
   - Guest → shows `LandingPage`
   - Authenticated → renders `HomeFeed` wrapped in `MainLayout` with sidebars
5. ✅ Simplified `src/app/(main)/page.tsx` to use shared `HomeFeed` component
6. ✅ Hydration-safe with `useHydration()` hook + skeleton loading

### Identified: Onboarding 500 Error (Backend Issue)
- `POST /users/interests` returns 500 Internal Server Error
- Frontend payload is correct: `{ category_ids: ["id1", "id2", ...] }`
- This is a **backend issue** — needs investigation in Go backend logs

### Article Editor (Phase 3)
7. ✅ Zod validation schema for articles (`src/lib/validations/article.ts`)
8. ✅ Media upload hook with TanStack Query (`src/hooks/use-media-upload.ts`)
9. ✅ Auto-save hook with debounce, create/update lifecycle, beforeunload warning (`src/hooks/use-auto-save.ts`)
10. ✅ Tiptap editor styles added to `globals.css` (placeholder, images, code blocks, blockquotes, links, syntax highlighting)
11. ✅ Added `getById` method to `articlesApi` and `useArticleById` hook
12. ✅ Tiptap editor component with extensions config (`src/components/editor/tiptap-editor.tsx`):
    - StarterKit (bold, italic, strike, code, headings H2/H3, lists, blockquote, history)
    - Image extension (non-inline, URL-based)
    - Link extension (autolink, no click navigation in editor)
    - CodeBlockLowlight with syntax highlighting
    - Placeholder ("Tell your story...")
13. ✅ Editor toolbar with all formatting buttons (`src/components/editor/editor-toolbar.tsx`):
    - Text: Bold, Italic, Strikethrough, Inline Code
    - Headings: H2, H3
    - Lists: Bullet, Ordered, Blockquote
    - Insert: Link, Image, Code Block, Horizontal Rule
    - History: Undo, Redo
    - Active state highlighting, disabled state handling
14. ✅ Editor preview with prose-article styling (`src/components/editor/editor-preview.tsx`)
15. ✅ Featured image upload with drag-drop (`src/components/editor/featured-image-upload.tsx`)
16. ✅ Publish dialog with category select, tag pills, excerpt, featured image (`src/components/editor/publish-dialog.tsx`)
17. ✅ Main article editor orchestrator (`src/components/editor/article-editor.tsx`):
    - Auto-resize title/subtitle textareas
    - Shared Tiptap editor instance between toolbar and content
    - Image upload via toolbar button + drag-and-drop + paste
    - Auto-save with status indicator (idle/saving/saved/error)
    - Word count display
    - Preview toggle
    - Publish/Update flow with metadata dialog
    - Save as draft flow
    - Post-publish redirect to article page
18. ✅ Write page with auth guard (`src/app/(main)/write/page.tsx`)
19. ✅ Edit page with auth guard + ownership check (`src/app/(main)/edit/[id]/page.tsx`)
20. ✅ Main layout updated — hides right sidebar on editor pages for distraction-free writing
21. ✅ Barrel exports updated (`src/components/editor/index.ts`, `src/hooks/index.ts`)
22. ✅ Build compiles successfully with all routes registered

### Bug Fixes During Editor Testing
23. ✅ Fixed Tiptap SSR error — added `immediatelyRender: false` to `useEditor()` config in `article-editor.tsx`
24. ✅ Fixed auto-save firing on mount — Tiptap generates `<p></p>` as empty HTML, added `getTextContent()` to strip HTML tags and `hasMountedRef` to skip initial mount
25. ✅ Fixed 400 validation error on article creation — backend expects `category_ids` (array) not `category_id` (singular string):
    - Changed `CreateArticleData.category_id` → `category_ids: string[]` in types
    - Updated auto-save to always send `category_ids: []` and `tag_ids: []` in create payload
    - Updated `PublishMetadata`, publish dialog, and article editor handlers to use `category_ids` array
    - Updated Zod validation schema to match

### Cloudinary Image Upload Integration
26. ✅ Switched image uploads from backend `/media/upload` to Cloudinary:
    - Added Cloudinary env vars to `.env.local` (API secret stays server-side only)
    - Created Next.js API route `src/app/api/upload/route.ts` — receives file, generates Cloudinary signature server-side, uploads to Cloudinary, returns URL
    - Updated `src/lib/api/media.ts` — `mediaApi.upload()` now calls `/api/upload` instead of backend
    - Added Cloudinary `res.cloudinary.com` to `next.config.ts` `images.remotePatterns`
    - Images stored in `alfafaa-blog` folder on Cloudinary (cloud: `dwjhoilfe`)

### Fix: Images Not Displaying on Home Page & Article Detail
27. ✅ Defined `xs` breakpoint (480px) in `@theme inline` in `globals.css` — article card thumbnails used `hidden xs:block` but `xs` wasn't a defined breakpoint, so images were permanently hidden
28. ✅ Added `prose-article img` styles for the reading view — inline images in article content had no styling outside the Tiptap editor (`.tiptap img` styles didn't apply to the `prose-article` container on the detail page)

### Fix: Backend Field Name Mismatches (Major)
29. ✅ Discovered backend API uses different field names than frontend types — curled the backend API and found 4 mismatches:
    - `featured_image` → `featured_image_url` (why featured images weren't saving/displaying)
    - `avatar_url` → `profile_image_url` (user avatars)
    - `reading_time` → `reading_time_minutes`
    - `category` (singular object) → `categories` (array)
30. ✅ Updated `src/types/index.ts` — renamed all fields in `Article`, `ArticleCard`, `User`, `CreateArticleData`
31. ✅ Updated 12+ files across the codebase to use the correct field names:
    - Components: `article-card.tsx`, `article-editor.tsx`, `publish-dialog.tsx`, `navbar.tsx`, `featured-image-upload.tsx`
    - Pages: `article/[slug]/page.tsx`, `profile/[id]/page.tsx`, `page.tsx`
    - Layouts: `(main)/layout.tsx`
    - Hooks: `use-users.ts`
    - API: `users.ts`
    - Validations: `article.ts`
32. ✅ Added `unoptimized: true` to `next.config.ts` images — bypasses Next.js image proxy which was failing to serve Cloudinary images
33. ✅ Added `sizes` prop to all `<Image fill>` components for performance

### Fix: Auth Token Lost on Page Refresh (401 on API Calls)
34. ✅ Fixed access token not persisting across page refreshes — token was stored in-memory only (`let accessToken = null`), lost on every navigation/refresh. Updated `src/lib/api/client.ts` to persist token in `localStorage` and restore it on module load.

---

## Current State

### Tech Stack
- Next.js 16.1.6
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Zustand (state management)
- TanStack Query (server state)
- Axios (HTTP client)
- React Hook Form + Zod (forms)
- Tiptap v3.18.0 (rich text editor — NOW IN USE)
- @react-oauth/google (Google OAuth)
- date-fns (date formatting)
- Lucide React (icons)
- next-themes (dark mode)
- lowlight (syntax highlighting for code blocks)

### File Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx                  # Updated: hides sidebar on editor pages
│   │   ├── page.tsx                    # Uses HomeFeed component
│   │   ├── article/[slug]/page.tsx
│   │   ├── profile/[id]/page.tsx
│   │   ├── write/page.tsx              # NEW: article editor
│   │   └── edit/[id]/page.tsx          # NEW: edit existing article
│   ├── onboarding/page.tsx
│   ├── globals.css                     # Updated: Tiptap editor styles
│   ├── layout.tsx
│   └── page.tsx                        # Auth-aware: landing OR feed
├── components/
│   ├── articles/
│   │   ├── article-card.tsx
│   │   └── index.ts
│   ├── auth/
│   │   ├── google-button.tsx
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── index.ts
│   ├── editor/                         # NEW: entire directory
│   │   ├── article-editor.tsx          # Main orchestrator
│   │   ├── tiptap-editor.tsx           # Tiptap instance + extensions
│   │   ├── editor-toolbar.tsx          # Formatting toolbar
│   │   ├── editor-preview.tsx          # Preview renderer
│   │   ├── featured-image-upload.tsx   # Featured image upload
│   │   ├── publish-dialog.tsx          # Publish metadata dialog
│   │   └── index.ts
│   ├── home/
│   │   └── home-feed.tsx
│   ├── landing/
│   │   └── landing-page.tsx
│   ├── layout/
│   │   ├── main-layout.tsx
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── right-sidebar.tsx
│   │   └── index.ts
│   ├── ui/ (shadcn components)
│   └── providers.tsx
├── hooks/
│   ├── use-articles.ts                 # Updated: added useArticleById
│   ├── use-users.ts
│   ├── use-categories.ts
│   ├── use-media-upload.ts             # NEW
│   ├── use-auto-save.ts               # NEW
│   ├── use-hydration.ts
│   └── index.ts                        # Updated: new exports
├── lib/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── articles.ts                 # Updated: added getById
│   │   ├── users.ts
│   │   ├── categories.ts
│   │   ├── tags.ts
│   │   ├── search.ts
│   │   ├── media.ts
│   │   └── index.ts
│   ├── utils/
│   └── validations/
│       ├── auth.ts
│       └── article.ts                  # NEW
├── stores/
│   ├── auth-store.ts
│   └── index.ts
└── types/
    └── index.ts
```

### Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page (guest) OR Home feed (authenticated) |
| `/auth/login` | Login page |
| `/auth/signup` | Signup page |
| `/onboarding` | Topic selection (post-signup) |
| `/article/[slug]` | Article detail |
| `/profile/[id]` | User profile |
| `/write` | **NEW** — Article editor (new article) |
| `/edit/[id]` | **NEW** — Edit existing article |

---

## Remaining Tasks

### Phase 3: Creation & Engagement
- [x] Article editor with Tiptap rich text
- [x] Image upload for articles (Cloudinary)
- [ ] Comments system
- [ ] Bookmark functionality (save articles)
- [ ] Like/clap functionality
- [ ] Notifications system

### Phase 4: Discovery & Polish
- [ ] Search page with filters
- [ ] Settings page (profile edit, password change)
- [ ] Follow system improvements
- [ ] Performance optimization
- [ ] Mobile PWA considerations

### Upcoming Tasks (Noted for Later)
- [ ] **Graceful role-based error handling** — If a user with "reader" role tries to write, show a friendly message that their role needs to be "author" or "editor" (instead of raw API error)
- [ ] **Sync tags with backend** — Match frontend tag options to backend tags (dynamic, fetched from API). Current backend tags:
  | Tag | Slug |
  |-----|------|
  | Hadith | hadith |
  | Hajj | hajj |
  | Fasting | fasting |
  | Ramadan | ramadan |
  | Five Pillars | five-pillars |
  | Community | community |
  | Marriage | marriage |
  | History | history |
  | Salah | salah |
  | Quran | quran |
  | Zakat | zakat |
- [ ] **Sync categories with backend** — Match frontend category options to backend categories. Current backend categories:
  | Category | Slug |
  |----------|------|
  | Opinion | opinion |
  | People | people |
  | Islam | islam |
  | Purification | purification |
  | Deen | deen |
  | News | news |
  | Science & Technology | science-technology |
- **Note:** Tags and categories may be added or removed in the future — implementation should fetch dynamically from API

---

## Known Issues
- `POST /users/interests` returns 500 — backend issue, not frontend

---

## Environment Setup

### Required Environment Variables (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=481389534219-f05sg71j5pitgarm0crntrhop6nr21h3.apps.googleusercontent.com
```

### How to Run
```bash
npm install
npm run dev
```
