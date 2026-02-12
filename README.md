
# Smart Bookmark App

A simple bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Login**: Secure sign-in without passwords.
- **Private Bookmarks**: Users can only manage their own bookmarks.
- **Real-time Updates**: Changes reflect instantly across all open tabs.
- **Responsive Design**: Styled with Tailwind CSS for a modern look.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js
- A Supabase project with:
  - `bookmarks` table and RLS policies (see `supabase/schema.sql`)
  - Google OAuth enabled

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.local.example` to `.env.local` (or create it) and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deployed on Vercel: [INSERT LIVE URL HERE]
GitHub Repository: [INSERT GITHUB URL HERE]

## Development Notes

### Problems Encountered & Solutions

1.  **Next.js Initialization Stall**: The `create-next-app` process stalled during dependency installation.
    -   **Solution**: Terminated the process, moved files from the generated subdirectory to the root, and ran `npm install` manually.
2.  **SWC Binary Issue**: Encountered `not a valid Win32 application` error for `@next/swc-win32-x64-msvc` after moving files.
    -   **Solution**: Deleted `node_modules` and `package-lock.json` and performed a fresh `npm install` to ensure correct binary binding.
3.  **Supabase Auth Redirects**: Ensuring correct redirect URLs for both local development (localhost) and production (Vercel).
    -   **Solution**: Configured dynamic redirect logic in the auth callback route.
4.  **"Unsupported provider: provider is not enabled" Error**:
    -   **Cause**: Google OAuth is not enabled in the Supabase Authentication > Providers settings.
    -   **Solution**: Go to Supabase Dashboard > Authentication > Providers > Google and toggle it to "Enabled". You will need a Google Client ID and Secret (search for "Supabase Google OAuth" for a guide).

## Database Schema

Run the SQL commands in `supabase/schema.sql` in your Supabase SQL Editor to set up the database.
