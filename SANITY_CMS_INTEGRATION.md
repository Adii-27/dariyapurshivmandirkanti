# Sanity CMS Integration

This repository contains a Sanity Studio and a server-side content adapter for the public temple
website. Gallery, Temple Videos, Community Posts, Festivals & Events, and Temple Notices can be
managed from the Studio after the one-time project setup.

## Architecture

- `sanity.config.ts`: Studio configuration
- `sanity/schemaTypes`: document schemas
- `sanity/structure.ts`: administrator navigation
- `src/lib/sanity/cms.server.ts`: published-content GROQ query and adapters
- `src/lib/api/cms.functions.ts`: TanStack Start server function
- `.env.example`: website and Studio configuration

The public website never queries drafts. Sanity requests run through a server function, and an
optional private-dataset token remains server-only.

Gallery, Videos, and Festivals retain their existing local content. Published CMS records are
prepended and deduplicated against the local records, so adding the first CMS item never removes
existing website content. Updates remain empty until Community Posts, Festivals, or Temple Notices
are published.

## One-Time Setup

1. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage).
2. Create or select the `production` dataset.
3. Copy `.env.example` to `.env.local`.
4. Set both project ID variables to the new project ID.
5. Keep the dataset public, or add a Viewer token as `SANITY_API_READ_TOKEN` in the server hosting
   environment.
6. Start the Studio:

```powershell
npm run studio
```

The local Studio opens at `http://localhost:3333/studio`.

## Studio Commands

```powershell
npm run studio
npm run studio:validate
npm run studio:build
npm run studio:deploy
```

`studio:deploy` publishes the administrator interface to a Sanity-hosted URL. The first deployment
may ask for a Studio hostname or create an application ID.

## Publishing Behavior

- Gallery and Temple Videos use Sanity CDN image URLs with hotspot/crop support and automatic
  image formatting.
- Only documents published in Sanity are queried. Drafts never appear publicly.
- Community Posts and Temple Notices also require `Published = true`.
- Festivals & Events require `Published = true`.
- Featured Community Posts, Festivals, or Notices compete by date for the Featured Update.
- Recent Updates are sorted newest first.
- The Updates badge compares Sanity `_updatedAt` values with a visitor-local last-seen timestamp.
- Viewing or selecting Updates clears the badge locally.
- Festival countdowns respect `Countdown Enabled`.
- Direct video URLs retain the existing HTML video player and fullscreen control.
- YouTube URLs use privacy-enhanced embeds with native fullscreen support.

## Content Freshness

- The initial page render receives CMS content from the route loader.
- While the page is visible, React Query checks for published changes every 20 seconds.
- Polling pauses in background tabs and resumes on focus or network reconnect.
- CMS data is considered fresh for 10 seconds to avoid redundant focus and mount requests.
- Sanity content queries use the uncached API so a successful poll receives the latest published
  dataset state.
- The server keeps a 10-second in-process cache and deduplicates concurrent requests to limit direct
  Sanity API traffic.
- The Sanity Live Content API is not used. The bounded polling strategy keeps the existing
  server-only data boundary and also supports private datasets without exposing a read token.

## Content Workflow

1. Open the deployed Studio.
2. Select a collection.
3. Create, edit, publish, unpublish, or delete content.
4. For Community Posts, Festivals, and Notices, enable `Published` before publishing when the item
   should appear publicly.
5. Enable `Featured` on an item to make it eligible for the Featured Update.

No website code change or redeployment is required for subsequent content changes. Visitors receive
the latest published dataset content when the website loads.

## Volunteer-Friendly Studio

- Studio forms show only the fields volunteers need for publishing.
- Slugs, website visibility flags, content dates, gallery titles, video descriptions, and countdown
  settings remain compatible with existing documents but do not block website rendering when
  omitted.
- Studio uses Sanity's standard Publish action. GROQ fallbacks derive optional hidden values from
  visible fields and Sanity's system timestamps.
- Community Posts use the simple Title, Temple Photo, Content, and Feature fields.
- Temple Videos accept YouTube links only. Thumbnails are optional.
- Gallery categories use a single dropdown while remaining stored in the existing `categories`
  array used by the website.
- `Upload Temple Photos > Select Multiple Photos` publishes up to 30 photos in one workflow.
- Gallery list previews display image thumbnails for quick identification.
- Sanity's built-in `_createdAt` and `_updatedAt` timestamps remain automatic and hidden from normal
  editing.

## Deployment Variables

Configure these for the website deployment:

```text
VITE_SANITY_PROJECT_ID
VITE_SANITY_DATASET
SANITY_API_READ_TOKEN   # private datasets only
```

Configure these for Studio commands and Studio deployment:

```text
SANITY_STUDIO_PROJECT_ID
SANITY_STUDIO_DATASET
SANITY_STUDIO_APP_ID    # optional until first deployment
```

Never expose `SANITY_API_READ_TOKEN` through a `VITE_` or `SANITY_STUDIO_` variable.
