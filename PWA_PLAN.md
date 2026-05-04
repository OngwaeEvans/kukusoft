# Kukusoft PWA Implementation Plan

## 1. Objectives
- **Zero-Latency Launches**: Cached assets allow the app to open instantly.
- **Home Screen Presence**: Users can "Install" Kukusoft like a native Android/iOS app.
- **Offline Resilience**: Full functionality without an active internet connection.

## 2. Core Components

### A. Web App Manifest (`manifest.webmanifest`)
Defines the app's appearance on the home screen:
- **Display**: `standalone` (removes browser URL bar).
- **Orientation**: `portrait-primary`.
- **Theme Color**: `#10b981` (Emerald 500).
- **Icons**: High-resolution (192x192, 512x512) masks for cross-platform support.

### B. Service Worker (`sw.js`)
The background engine for offline support:
- **Installation**: Pre-caches the "App Shell" (HTML, CSS, JS, Fonts).
- **Activation**: Cleans up old cache versions.
- **Fetch Interceptor**: 
  - **Static Assets**: *Cache-First* strategy.
  - **Dynamic Data**: *Network-First* with an "Offline UI" fallback.

### C. IndexedDB (Local Storage Upgrade)
While `localStorage` is easy, it is synchronous and limited (5MB). We will transition to `IndexedDB` (using the `idb` library) for:
- **Journal Storage**: Millions of event logs without performance degradation.
- **Blob Support**: Allowing local storage of farm photos or documents in the future.

## 3. Caching Strategy
- **Versioned Cache**: `v1-kukusoft-assets`.
- **Runtime Cache**: For external assets like Google Fonts.

## 4. Install Flow
1. **Detection**: App listens for `beforeinstallprompt`.
2. **Promotion**: A "Install to Phone" button appears in Settings.
3. **Tracking**: App logs successful installs to help optimize UX.
