importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);

	workbox.precaching.precacheAndRoute([
  {
    "url": "asset-manifest.json",
    "revision": "44cbb9efd3d0b3790f49129d717e1df8"
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
    "revision": "c7f2932e42250e16f1906d7a42cc6270"
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
    "url": "precache-manifest.f2fe014ac2a1e9efc7ba75a1cd434e04.js",
    "revision": "f2fe014ac2a1e9efc7ba75a1cd434e04"
  },
  {
    "url": "service-worker.js",
    "revision": "1643cd93dc48b255ffa0e6851a78e9a3"
  },
  {
    "url": "static/css/2.079854c7.chunk.css",
    "revision": "2d87633e12f615262cd701674975f5b1"
  },
  {
    "url": "static/js/2.ef1eb5fe.chunk.js",
    "revision": "5715457a79e2bd540ecdd78d0c42a382"
  },
  {
    "url": "static/js/main.f985ca45.chunk.js",
    "revision": "791cc37acb26c9f09ca5d1caae974b11"
  },
  {
    "url": "static/js/runtime-main.14b154d7.js",
    "revision": "2f710e76f9091fbbfbe054e8d2522a1f"
  },
  {
    "url": "static/media/facebook.8ddf98ef.svg",
    "revision": "8ddf98efb58ff9f07272ae5b87fbf649"
  },
  {
    "url": "static/media/github.3ba30a77.svg",
    "revision": "3ba30a775b6c5f1e785a226ec76bd79a"
  },
  {
    "url": "static/media/linkedin.e38fbff1.svg",
    "revision": "e38fbff117f540e82c006e8b4c1d1521"
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
    "url": "static/media/upwork.3bbafc95.svg",
    "revision": "3bbafc951d10111231379d372adc1272"
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

const cachesToRemove = [
	/pages-cache/,
	// /workbox-precache/, // enable when I want to remove old image from cache
]
const staticCacheName = 'pages-cache-v2';

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