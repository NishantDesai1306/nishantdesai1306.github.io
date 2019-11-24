importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded`);

	workbox.precaching.precacheAndRoute([
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
    "revision": "6f1be41ef96091aedad750a604dd4559"
  },
  {
    "url": "index.html",
    "revision": "7ed30339492eae40d25b3790f75002dd"
  },
  {
    "url": "manifest.json",
    "revision": "cd2a10022206349f51fc76b28c95196d"
  },
  {
    "url": "offline.html",
    "revision": "b7d4bc9c12586dc142bef4af481ddf4b"
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
	console.log(`Boo! Workbox didn't load`);
}

const cachesToRemove = [
	/pages-cache/,
	// /workbox-precache/, // enable when I want to remove old image from cache
]
const staticCacheName = 'pages-cache-v3';

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cachesToRemove.some((cacheNameRegex) => cacheNameRegex.test(cacheName))
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

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