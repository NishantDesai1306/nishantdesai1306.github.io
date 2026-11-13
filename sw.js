// Compatibility entry point for visitors who installed the original /sw.js.
// Reuse the maintained worker rather than reviving the old cache-first worker.
importScripts('./service-worker.js');
self.addEventListener('install', () => self.skipWaiting());
