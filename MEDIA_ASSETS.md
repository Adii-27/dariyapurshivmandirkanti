# Temple Media Assets

## Canonical runtime catalog

Runtime media is cataloged in `src/lib/media.ts`.

- `public/Banner.png`: permanent homepage hero and social preview image
- `public/logo.png`: navigation and footer logo
- `public/Temple images/`: authentic day, evening, night, interior, festival, and edited images
- `public/optimized/Temple images/`: optimized JPEG variants used where available
- Sanity CMS: all temple video URLs and optional video thumbnails

## Component usage

- `Hero.tsx`: `Banner.png`
- `Welcome.tsx`: featured Temple Introduction video from Sanity CMS
- `Gallery.tsx`: complete unique temple photo catalog
- `Videos.tsx`: all published Sanity CMS temple videos
- `About.tsx`: selected authentic temple images
- `Location.tsx`: selected Temple Glimpses images
- `Navbar.tsx` and `Footer.tsx`: temple logo

## Video categories

- All Videos
- Temple Introduction
- Highlights
- Festivals & Events Activities

Categories display the videos currently published through Sanity CMS.

## Loading behavior

- Images use optimized variants and lazy loading outside featured areas.
- Video cards use Sanity CMS thumbnails when provided.
- The Welcome section uses the featured Introduction thumbnail when provided.
- YouTube videos play through privacy-enhanced embeds.
- Full video playback occurs in an accessible responsive modal.

## Optimized image sources

The runtime catalog points to files under `public/optimized/Temple images/`. Duplicate and oversized
source images are not required by the website.
