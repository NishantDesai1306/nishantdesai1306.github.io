importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);

	workbox.precaching.precacheAndRoute([
  {
    "url": "asset-manifest.json",
    "revision": "1ef45c53cff3381509374aeb703d7ea3"
  },
  {
    "url": "favicon.ico",
    "revision": "c92b85a5b907c70211f4ec25e29a8c4a"
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
    "revision": "8b64023a1d43d5acd9e926b30bcaefbc"
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
    "url": "precache-manifest.39e4fce2969c61ed14c7cf2854f876fa.js",
    "revision": "39e4fce2969c61ed14c7cf2854f876fa"
  },
  {
    "url": "service-worker.js",
    "revision": "57f28db3222a26718f287e12860fa3cf"
  },
  {
    "url": "static/css/2.079854c7.chunk.css",
    "revision": "2d87633e12f615262cd701674975f5b1"
  },
  {
    "url": "static/js/2.a5550584.chunk.js",
    "revision": "c2b801b73db5f436d71404dbaf9925db"
  },
  {
    "url": "static/js/main.1ddbd6c2.chunk.js",
    "revision": "fc6d6d989086a30549b6f3201a00337a"
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
    "url": "static/media/owner.15261581.jpg",
    "revision": "1526158138b5763ada56b840645ae430"
  },
  {
    "url": "static/media/pdp_vs_ts.46f4b312.png",
    "revision": "46f4b31261b4c4aa894b7e53f49c5f23"
  },
  {
    "url": "static/media/smart-copy.b4b9b233.png",
    "revision": "b4b9b23396266a32aec1a257a72babbf"
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