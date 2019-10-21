importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);

	workbox.precaching.precacheAndRoute([
  {
    "url": "asset-manifest.json",
    "revision": "f71aee637ccfb400c768e285b19e65a7"
  },
  {
    "url": "favicon.ico",
    "revision": "ad6e685001b0bcfc0ebdf4e0fba548fd"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "199359b366eeaaa22dbf98c38ca883fc"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "69a7b59454920159386b279559c8431e"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "775bd1de1e52d786672f619d76b04eea"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "36ed9f4930524958cb3dc3a217f02775"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "3908d41515d8e8f388b1ab080f788410"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "95ffe127d9f7ac123cb0d3e9816aba6b"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "40f75e3121c7146d08555e0b66ab8305"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "5378ae9aa9b4fa19a67f84505cb3bd06"
  },
  {
    "url": "index.css",
    "revision": "aa2f2f0de2f29d2b86f9ae9a931c23d3"
  },
  {
    "url": "index.html",
    "revision": "8a13f1c35c3daed02482ce6ceeb236da"
  },
  {
    "url": "manifest.json",
    "revision": "61e4673adb4a3a0587f52b3dff125dc6"
  },
  {
    "url": "offline.html",
    "revision": "b7d4bc9c12586dc142bef4af481ddf4b"
  },
  {
    "url": "precache-manifest.10e69c2eb64f6c12e7f640872b1bec37.js",
    "revision": "10e69c2eb64f6c12e7f640872b1bec37"
  },
  {
    "url": "service-worker.js",
    "revision": "6299d45ab14b795f2da78a149e9d2388"
  },
  {
    "url": "static/css/2.079854c7.chunk.css",
    "revision": "2d87633e12f615262cd701674975f5b1"
  },
  {
    "url": "static/js/2.28acefab.chunk.js",
    "revision": "dada377b8ce0e79290914fb4d28a726f"
  },
  {
    "url": "static/js/main.a74f8394.chunk.js",
    "revision": "53ace9dcc590b0efcbe6ef263f47d0f9"
  },
  {
    "url": "static/js/runtime-main.14b154d7.js",
    "revision": "2f710e76f9091fbbfbe054e8d2522a1f"
  },
  {
    "url": "static/media/facebook.2480ae73.svg",
    "revision": "2480ae73ad8985a192a4fd1c132e60ec"
  },
  {
    "url": "static/media/github.ba679906.svg",
    "revision": "ba679906e271d70b0c6c0f2460e8d2e5"
  },
  {
    "url": "static/media/linkedin.80819046.svg",
    "revision": "80819046a463448a7d16a06f7cd5b39b"
  },
  {
    "url": "static/media/lost_box.6e4c0ee4.png",
    "revision": "6e4c0ee4e86db377f9f5c07d5dedd54a"
  },
  {
    "url": "static/media/owner.95ffe127.png",
    "revision": "95ffe127d9f7ac123cb0d3e9816aba6b"
  },
  {
    "url": "static/media/pdp_vs_ts.554e1164.png",
    "revision": "554e11644eff7919702a70948bfd3e04"
  },
  {
    "url": "static/media/smart-copy.f0813471.png",
    "revision": "f08134710f5a21af7ec146adfc1b84cb"
  },
  {
    "url": "static/media/upwork.2cc99461.svg",
    "revision": "2cc9946167d04417edbb426da2c953a6"
  }
]);

	workbox.routing.setCatchHandler(({ event }) => {

		switch (event.request.destination) {
			case 'document':
				return caches.match('/offline.html');
				break;
		}
	});
} else {
	console.log(`Boo! Workbox didn't load 😬`);
}

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', (event) => {
	const urls = [
		'https://fonts.googleapis.com/icon?family=Material+Icons',
		'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
		'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
		'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2'
	];
	const cacheName = workbox.core.cacheNames.runtime;
	event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (event.request.url.includes('fonts.')) {
					console.log(event.request.url, response);
				}

				if (response) {
					return response;
				}

				return fetch(event.request)
					.then(response => {
						const contentTypeHeader = response.headers.get('content-type');

						if (
							!event.request.url.startsWith('http') ||
							(
								contentTypeHeader && contentTypeHeader.includes('json')
							)
						) {
							return Promise.resolve(response);
						}

						return caches.open(staticCacheName).then(cache => {
							console.log('caching', event.request.url);
							cache.put(event.request.url, response.clone());
							return response;
						});
					});

			}).catch(error => {

				console.log('errior', error)

			})
	);
});