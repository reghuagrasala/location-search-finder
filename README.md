# Location Search Finder

A lightweight static PWA inspired by the supplied iPhone recording.

## Features
- Compact one-row search tabs.
- Long vertical list that can be scrolled from top to bottom.
- **Change** bar for a custom town, area, address or landmark.
- **Use GPS** option without any geocoding/API service.
- Every category opens a Google Maps place-search results page.
- Bottom **Custom POI Search** for any search term.
- Returning from Google Maps restores the web app to the top.
- Local place preference is stored in the browser.
- Offline PWA shell via service worker.
- No API keys and no server/backend.

## GitHub Pages / Cloudflare Pages
The project is static. Upload the contents of this folder to a GitHub repository named `location-search-finder`, then connect that repository to Cloudflare Pages.

Cloudflare Pages settings:
- Framework preset: **None**
- Build command: **leave blank**
- Build output directory: **/**
- Root directory: **/**

After deployment, open the `*.pages.dev` URL in Safari and use **Add to Home Screen**.

## Google Maps behavior
Searches use Google's public Maps search URL format. The app does not scrape Google Maps and does not need a Google Maps API key.

Examples:
- `Restaurant near Chalakkudy`
- `Airport near Kochi`
- `EV charging near 10.123456,76.123456`

## Important iPhone behavior
The app deliberately navigates the current Safari/PWA window to Google Maps. When Safari/PWA becomes visible again, it calls `scrollTo(0,0)` so the app returns to its top.


## Release
- Version: **1.0.0**
- Offline application shell is available after the first successful online load.
- Network status indicator: green = normal, yellow = weak/slow when supported by the browser, red = offline.
- Google Maps searches require an Internet connection.
- The app is designed for iPhone/PWA portrait use with vertical scrolling and pinch zoom disabled.

## Cloudflare Pages
Recommended deployment settings:
- Framework preset: **None**
- Build command: **None**
- Build output directory: **/** 
- Root directory: **/**
- The included `_headers` file is used by Cloudflare Pages for security/privacy response headers.

Cloudflare Workers Builds is configured for automatic deployment from the `main` branch.

Cloudflare build trigger check: 2026-09-30 19:48 IST.
