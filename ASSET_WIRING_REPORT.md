# Media Wiring Report

## Current wiring

- Permanent hero: `Banner.png`
- Social preview: `Banner.png`
- Introduction preview and playback: featured Temple Introduction video from Sanity CMS
- Temple video gallery and thumbnails: Sanity CMS only
- Gallery: all unique uploaded day, evening, night, interior, festival, and edited temple images
- Temple Glimpses: selected authentic temple images inside Location & Directions
- Logo: navigation and footer

## Interaction coverage

- Gallery filtering and lightbox
- Video filtering, modal playback, and fullscreen
- Virtual Darshan Street View modal
- Infinite Temple Glimpses carousel with hover, focus, pointer pause, and touch scrolling
- New-tab social links for Instagram, Facebook, and YouTube

## Removed legacy content

The former local video files, local introduction thumbnail, and obsolete video asset metadata have
been removed. Video URLs and thumbnails now come from Sanity CMS.

## Validation commands

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
npm.cmd run lint
npm.cmd run build
```
