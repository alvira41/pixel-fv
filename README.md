# Pixel Memory Couple + Supabase

Next.js pixel-art couple website with a shared Supabase database and a private editor.

## 1. Create Supabase
Create a project at Supabase, then open **SQL Editor** and run the entire `supabase_schema.sql` file.

The schema contains:
- `site_content` — the main website text
- `memories` — Memory Book entries
- Row Level Security: public visitors can read; logged-in users can edit.

Supabase's current Next.js guidance uses a project URL and publishable key as environment variables. See the official docs: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

## 2. Create the editor account
In Supabase Authentication, create the account you want to use for `/edit` (or use the Create Account button). For a private site, do not share that account.

## 3. Environment variables
Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Never commit real environment values. Add the same variables to Vercel Project Settings > Environment Variables.

## 4. Run
```bash
npm install
npm run dev
```

Open:
- http://localhost:3000 — public couple website
- http://localhost:3000/edit — login + editor

## 5. Deploy
Push to GitHub and import the repository into Vercel. Add the two Supabase environment variables in Vercel before deploying.

After deployment:
- everyone can see the same text/memories
- only an authenticated editor can modify them
- changes made from `/edit` are stored in Supabase and immediately become shared data


## What's new (v2.2)
- Pixel couple redrawn from the reference photos: girl = round thin black glasses, wavy hair, pink tee, white wide pants, red crossbody bag, white crocs; boy = thin rectangular glasses, fluffy hair, grey shirt + navy vest, baggy grey pants, navy crocs. Sprites live in `lib/sprites.ts` (edit the letter grids to tweak).
- Livelier scene: concrete wall + black handrail + steps + cafe terrace with wooden chairs, string lights, drifting clouds, petals/fireflies, butterflies, a cat. Auto day/night.
- Tap the girl, boy, or cat for speech bubbles and floating hearts.
- Progress is saved in the browser (love, coins, mood, best streak, daily kiss). Mood slowly drops while you're away.
- Daily Kiss bonus, coin shop (Feed tab), two mini-games (Heart Hunt, Memory Match using your memory emojis).
- Special date countdown; use `YYYY-MM-DD` to also show "DAY N TOGETHER".
- Editor: reorder memories, quick emoji picker, delete confirmation, unsaved-changes warning, safer saving.
- Fixed: `@/` import alias was missing from `tsconfig.json` (build would fail).
