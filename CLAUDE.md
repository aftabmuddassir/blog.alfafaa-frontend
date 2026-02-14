# Alfafaa Blog Frontend

## Project Overview
Build a modern, professional blog platform frontend for Alfafaa Community using Next.js 14+ (App Router). The design philosophy combines Medium's minimalist, reading-focused experience with Airbnb's modern aesthetic and attention to detail.

**Backend API**: `http://localhost:8080/api/v1` (Go/Gin REST API - see API documentation below)

---

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand for global state, TanStack Query for server state
- **Authentication**: JWT tokens stored in httpOnly cookies, Google OAuth
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: Tiptap editor for article creation
- **Icons**: Lucide React
- **Fonts**: Inter (UI) + Merriweather or Charter (article body)

---

## Design System

### Brand Identity
- **Primary Color**: Deep teal (#0D9488) - trust, knowledge
- **Accent**: Warm amber (#F59E0B) - energy, community
- **Neutrals**: Slate palette for text and backgrounds
- **Success/Error**: Standard green/red semantic colors

### Typography
- **Headlines**: Inter, 700 weight, tight letter-spacing
- **Body (UI)**: Inter, 400/500 weight
- **Article Content**: Merriweather or Charter, 18-20px, 1.7-1.8 line-height, max-width 680px
- **Reading optimization**: ~70-80 characters per line

### Spacing & Layout
- Use 8px grid system
- Generous whitespace (Airbnb-inspired)
- Subtle shadows and rounded corners (8-12px radius)
- Smooth transitions (150-200ms ease)

---

## Core Pages & Features

### 1. Authentication (`/auth/login`, `/auth/signup`)
- Clean, centered card layout
- Social login buttons (Google OAuth priority) with branded styling
- Email/password as secondary option
- Inline validation with helpful error messages
- "Forgot password" flow
- Seamless redirect after authentication

**API Endpoints:**
- `POST /auth/register` - Email registration
- `POST /auth/login` - Email login
- `POST /auth/google` - Google OAuth (send ID token)
- `POST /auth/refresh-token` - Token refresh
- `GET /auth/me` - Current user

### 2. Onboarding (`/onboarding`)
Design an engaging topic selection experience:

**Layout:**
- Centered container, max-width 800px
- Header: "What would you like to read?" (h1) + "Choose 3 or more topics to continue" (subtitle)
- Categories organized in sections with bold headings

**Topic Pills/Bubbles:**
- Flexbox wrap layout
- Rounded capsule shape (full rounded, px-4 py-2)
- **Unselected**: White/light background, thin border (border-slate-200)
- **Selected**: Solid pastel background matching category color, no border, subtle scale animation
- Color coding by category:
  - Technology: Light blue (#DBEAFE)
  - Programming: Soft green (#D1FAE5)
  - Wellness/Lifestyle: Light pink (#FCE7F3)
  - Islam/Deen: Soft teal (#CCFBF1)
  - News: Light amber (#FEF3C7)
  - Science: Light purple (#EDE9FE)

**Interaction:**
- Multi-select toggle
- Visual counter showing selected count
- "Continue" button disabled until 3+ selected
- Smooth transitions on selection
- Progress indicator if multi-step

**API Endpoints:**
- `GET /categories?hierarchical=true` - Get category tree
- `POST /users/interests` - Save selected categories

### 3. Home Page (`/`)
Three-column responsive layout:

**Top Navbar (sticky):**
- Left: Logo/brand mark
- Center: Rounded search bar (expandable on focus)
- Right: "Write" button (pen icon + text), notification bell, user avatar dropdown
- Mobile: Hamburger menu, simplified actions

**Left Sidebar (desktop only, collapsible):**
- Icon-based navigation rail
- Home, Explore, Bookmarks/Library, Profile, Settings
- Minimalist, ~64px width when collapsed

**Main Content (center):**
- Tab interface: "For You" | "Following" | "Featured"
- Infinite scroll article feed
- **Article Card Design:**
  - Author avatar + name + publication date (top)
  - Title (h2, bold, 2-line clamp)
  - Subtitle/excerpt (muted, 2-line clamp)
  - Bottom row: Category pill, reading time, bookmark icon
  - Right side: Thumbnail image (16:10 ratio, rounded)
  - Hover: Subtle elevation/shadow
  - Clean separation with subtle dividers or spacing

**Right Sidebar (desktop only):**
- "Staff Picks" section with compact article cards
- "Recommended Topics" pill cloud
- "Who to Follow" user suggestions with Follow buttons
- Footer links (Help, Privacy, Terms)

**API Endpoints:**
- `GET /articles/feed` - Personalized feed (authenticated)
- `GET /articles/trending` - Trending articles
- `GET /articles/recent` - Recent articles
- `GET /articles/staff-picks` - Staff picks
- `GET /tags/popular` - Popular tags
- `GET /categories` - All categories

### 4. Article Detail Page (`/article/[slug]`)
Immersive, distraction-free reading experience:

**Pre-Content Header:**
- Full-width or contained hero image (if featured image exists)
- Title: Large, bold typography (32-40px)
- Author row: Avatar, name (link to profile), "Follow" button
- Meta: Publication date, reading time (e.g., "5 min read")
- More options menu (⋮): Report, Mute author, Copy link, Share

**Content Body:**
- Single centered column, max-width 680px
- Generous top/bottom padding
- Typography optimized for reading:
  - Serif font for body text
  - Proper heading hierarchy (h2, h3)
  - Styled blockquotes (left border, italic)
  - Code blocks with syntax highlighting
  - Full-width images with captions
- **ZERO interruptions**: No ads, no sidebars, no pop-ups during reading

**Post-Content Engagement:**
- Sticky bottom bar (or inline): Clap/like button with count, comment icon, share, bookmark
- Author bio card: Larger avatar, full bio, prominent "Follow" CTA
- Tags/categories pills
- Divider

**Recommendations (ONLY after content):**
- "More from [Author]" section
- "Recommended for you" grid (3 cards)
- Comments section (collapsible or below recommendations)

**API Endpoints:**
- `GET /articles/:slug` - Article detail
- `GET /articles/:slug/related` - Related articles
- `GET /users/:id/articles` - More from author

### 5. Article Editor (`/write`, `/edit/[id]`)
- Clean, distraction-free writing interface
- Tiptap rich text editor with:
  - Formatting toolbar (bold, italic, headings, lists)
  - Image upload integration
  - Code block support
  - Embed support (if needed)
- Title input (large, placeholder: "Title")
- Auto-save drafts (debounced)
- Publish flow: Category selection, tags, excerpt, featured image
- Preview mode

**API Endpoints:**
- `POST /articles` - Create article
- `PUT /articles/:id` - Update article
- `POST /media/upload` - Upload images

### 6. User Profile (`/profile/[id]`)
- Cover area with avatar, name, bio
- Stats: Followers, Following, Articles count
- Follow/Unfollow button (if not own profile)
- Tabs: Articles, About, Lists (future)
- Article grid/list

**API Endpoints:**
- `GET /users/:id/profile` - Profile with social stats
- `GET /users/:id/articles` - User's articles
- `POST /users/:id/follow` - Follow user
- `POST /users/:id/unfollow` - Unfollow user
- `GET /users/:id/followers` - Followers list
- `GET /users/:id/following` - Following list

### 7. Search (`/search`)
- Full-page search with filters
- Tabs: Articles, People, Tags, Categories
- Faceted filtering (date range, category)
- Highlighted search terms in results

**API Endpoint:**
- `GET /search?q=query&type=articles|categories|tags|all`

### 8. Settings (`/settings`)
- Profile editing
- Account settings
- Notification preferences
- Password change (for non-OAuth users)

---

## Component Library

Build these reusable components:

### Core Components
- `Button` - Primary, secondary, ghost, outline variants
- `Input`, `Textarea` - With label, error states
- `Avatar` - Multiple sizes (sm, md, lg, xl)
- `Card` - Article card, user card variants
- `Badge/Pill` - For tags, categories
- `Dropdown` - User menu, more options
- `Modal/Dialog` - Confirmation, forms
- `Tabs` - For navigation within pages
- `Skeleton` - Loading states

### Domain Components
- `ArticleCard` - Feed item
- `ArticleCardCompact` - Sidebar/recommendations
- `AuthorRow` - Avatar + name + follow
- `AuthorBio` - End of article bio card
- `TopicPill` - Selectable category/tag
- `EngagementBar` - Claps, comments, share, bookmark
- `CommentThread` - Nested comments
- `InfiniteScroll` - Feed pagination
- `RichTextRenderer` - Article content display

---

## State Management

### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### TanStack Query Keys
- `['articles', 'feed']` - Personalized feed
- `['articles', 'trending']` - Trending
- `['article', slug]` - Single article
- `['user', id, 'profile']` - User profile
- `['categories']` - Categories list

---

## API Integration

### HTTP Client Setup
- Use Axios or fetch with interceptors
- Automatic token refresh on 401
- Request/response logging in development
- Error handling with user-friendly messages

### Response Format (from backend)
```typescript
// Success
{ success: true, message: string, data: T, meta?: PaginationMeta }

// Error
{ success: false, error: { code: string, message: string, details?: ValidationError[] } }
```

---

## File Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── page.tsx (home)
│   │   ├── article/[slug]/page.tsx
│   │   ├── profile/[id]/page.tsx
│   │   ├── write/page.tsx
│   │   ├── search/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── onboarding/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── articles/
│   ├── auth/
│   ├── layout/
│   └── shared/
├── hooks/
├── lib/
│   ├── api/
│   ├── utils/
│   └── validations/
├── stores/
└── types/
```

---

## Performance & UX

- Implement optimistic updates for likes/follows
- Skeleton loading states for all async content
- Image optimization with next/image
- Prefetch article on hover (for instant navigation)
- Proper error boundaries
- Offline-friendly (PWA consideration for future)
- Responsive breakpoints: sm(640), md(768), lg(1024), xl(1280)

---

## Accessibility

- Semantic HTML (article, nav, main, aside)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance (WCAG AA)
- Screen reader friendly

---

## Ad Integration (Future-Ready)

- Reserve ad slot components (but keep them empty/hidden for now)
- Potential placements: 
  - Between feed items (every 5-10 articles)
  - Sidebar (desktop)
  - End of article (NEVER during reading)
- Use a wrapper component for easy enable/disable

---

## Development Phases

### Phase 1: Foundation
- Project setup (Next.js, Tailwind, shadcn)
- Design system implementation
- Auth flow (login, signup, Google OAuth)
- Basic layout components

### Phase 2: Core Reading
- Home page with feed
- Article detail page (reading experience)
- User profile page

### Phase 3: Creation & Engagement
- Article editor
- Onboarding flow
- Comments system
- Follow/bookmark functionality

### Phase 4: Discovery & Polish
- Search
- Recommendations
- Settings
- Performance optimization
- Mobile refinements

---

## Backend API Reference

Base URL: `http://localhost:8080/api/v1`

### Authentication
- `POST /auth/register` - { username, email, password, first_name?, last_name? }
- `POST /auth/login` - { email, password }
- `POST /auth/google` - { id_token }
- `POST /auth/refresh-token` - { refresh_token }
- `GET /auth/me` - Current user (requires auth)
- `POST /auth/change-password` - { current_password, new_password }

### Articles
- `GET /articles` - List (query: page, per_page, category, tag, search)
- `GET /articles/:slug` - Detail
- `POST /articles` - Create (requires author+)
- `PUT /articles/:id` - Update
- `DELETE /articles/:id` - Delete
- `GET /articles/trending?limit=10`
- `GET /articles/recent?limit=10`
- `GET /articles/staff-picks`
- `GET /articles/feed` - Personalized (requires auth)
- `GET /articles/:slug/related?limit=5`

### Users
- `GET /users/:id` - Public profile
- `GET /users/:id/profile` - Full profile with stats
- `GET /users/:id/articles` - User's articles
- `PUT /users/:id` - Update own profile
- `POST /users/:id/follow`
- `POST /users/:id/unfollow`
- `GET /users/:id/followers`
- `GET /users/:id/following`
- `POST /users/interests` - { category_ids: [] }
- `GET /users/interests`

### Categories & Tags
- `GET /categories` - List (query: hierarchical=true)
- `GET /categories/:slug`
- `GET /categories/:slug/articles`
- `GET /tags` - List
- `GET /tags/popular?limit=10`
- `GET /tags/:slug/articles`

### Media
- `POST /media/upload` - multipart/form-data (file, alt_text?)
- `GET /media/:id`

### Search
- `GET /search?q=query&type=all|articles|categories|tags`

### Auth Header
```
Authorization: Bearer <access_token>
```

### Response Pagination Meta
```json
{
  "page": 1,
  "per_page": 20,
  "total": 100,
  "total_pages": 5
}
```