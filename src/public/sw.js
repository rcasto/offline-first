var staticCacheName = 'offline-first-v1';

self.addEventListener('install', function (event) {
    caches.open(staticCacheName).then(function (cache) {
        return cache.addAll([
            '/',
            '/images/mug.svg',
            '/scripts/lib/full.js',
            '/scripts/lib/native-shim.min.js',
            '/scripts/app.js',
            '/images/test-video.mp4',
            // '/images/the-dictator.mp4'
        ]);
    });
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        /* 
            Delete all old caches related to this service worker, 
            except for the one associated with the latest
            service worker
        */
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('offline-') &&
                           cacheName !== staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    /*
        Intercept network requests and respond with content
        from cache, if available for request.  Otherwise send
        request through using Fetch API

        request -> response keys
    */
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});