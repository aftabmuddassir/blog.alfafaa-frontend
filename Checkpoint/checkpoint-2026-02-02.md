# Checkpoint - 2026-02-02 (Google OAuth & Onboarding Fixes)

## Previous Checkpoints
- [checkpoint-2026-02-01.md](checkpoint-2026-02-01.md) — Phase 1 (Foundation) + Phase 2 (Core Reading Experience)

## What Was Done This Session

### Google OAuth Authentication
1. ✅ Fixed Google OAuth - switched from `useGoogleLogin` (returns access token) to `GoogleLogin` component (returns proper ID token)
2. ✅ Fixed `AuthResponse` type to match backend API:
    ```typescript
    // Before (wrong)
    { user, tokens: { access_token, refresh_token, expires_in } }
    // After (correct)
    { user, access_token, refresh_token, expires_at }
    ```
3. ✅ Updated `authApi` functions to read tokens from correct location
4. ✅ Signup redirects to `/onboarding` after Google OAuth

### Route Structure Fix
5. ✅ Renamed `(auth)` folder to `auth` for proper URL paths (`/auth/login`, `/auth/signup`)

### Onboarding Page
6. ✅ Onboarding page with topic selection (colorful pills)
7. ✅ Category fetching with hierarchical structure
8. ✅ Multi-select with minimum 3 topics requirement
9. ✅ Progress indicator showing selection count
10. ✅ Fixed flickering issue with `useHydration` hook
11. ✅ Mobile-responsive with fixed bottom continue button

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
- @react-oauth/google (Google OAuth)
- date-fns (date formatting)
- Lucide React (icons)
- next-themes (dark mode)

### File Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (home with feed)
│   │   ├── article/[slug]/page.tsx
│   │   └── profile/[id]/page.tsx
│   ├── onboarding/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (landing)
├── components/
│   ├── articles/
│   │   ├── article-card.tsx
│   │   └── index.ts
│   ├── auth/
│   │   ├── google-button.tsx    # Fixed: uses GoogleLogin for ID token
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx      # Fixed: redirectTo="/onboarding"
│   │   └── index.ts
│   ├── layout/
│   │   ├── main-layout.tsx
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── right-sidebar.tsx
│   │   └── index.ts
│   ├── ui/ (shadcn components)
│   └── providers.tsx
├── hooks/
│   ├── use-articles.ts
│   ├── use-users.ts
│   ├── use-categories.ts
│   ├── use-hydration.ts         # NEW: Zustand hydration detection
│   └── index.ts
├── lib/
│   ├── api/
│   │   ├── auth.ts              # Fixed: correct token extraction
│   │   ├── client.ts
│   │   └── ...
│   ├── utils/
│   └── validations/
├── stores/
│   ├── auth-store.ts
│   └── index.ts
└── types/
    └── index.ts                  # Fixed: AuthResponse structure
```

### Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page (unauthenticated) |
| `/auth/login` | Login page |
| `/auth/signup` | Signup page |
| `/onboarding` | Topic selection (post-signup) |
| `/` (main) | Home feed (authenticated) |
| `/article/[slug]` | Article detail |
| `/profile/[id]` | User profile |

---

## Next Tasks

### Phase 3: Creation & Engagement
- [ ] Article editor with Tiptap rich text
- [ ] Image upload for articles
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

---

## Known Issues
- None currently

---

## Environment Setup

### Required Environment Variables (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=481389534219-f05sg71j5pitgarm0crntrhop6nr21h3.apps.googleusercontent.com
```

### Backend Requirements
- Backend API at `http://localhost:8081/api/v1` (Go/Gin REST API)
- CORS must be configured for `http://localhost:3000`
- Google OAuth configured in Google Cloud Console

---

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Key Fixes Reference

### Google OAuth Token Issue
**Problem**: Frontend was sending access token (340 chars) instead of ID token (800+ chars)
**Solution**: Changed from `useGoogleLogin` hook to `GoogleLogin` component which returns `credentialResponse.credential` (the ID token)

### Auth Response Mismatch
**Problem**: Frontend expected `{ user, tokens: { access_token } }` but backend returns `{ user, access_token, refresh_token, expires_at }`
**Solution**: Updated `AuthResponse` type and `authApi` functions to match actual backend response

### Onboarding Flickering
**Problem**: Page showed skeleton repeatedly due to Zustand hydration
**Solution**: Created `useHydration` hook that returns `true` after client-side mount, replacing unreliable `isInitialized` state

---

## API Endpoints Used

### Authentication
- `POST /auth/google` - Google OAuth (sends `{ id_token }`)
- `POST /auth/login` - Email login
- `POST /auth/register` - Email registration
- `GET /auth/me` - Current user

### Categories
- `GET /categories?hierarchical=true` - Get category tree for onboarding

### Users
- `POST /users/interests` - Save selected categories
