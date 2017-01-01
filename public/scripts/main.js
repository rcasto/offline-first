// Register service worker if browser supports it
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        // Page not currently controlled by service worker, by default has latest
        if (!navigator.serviceWorker.controller) {
            return;
        }

        // If there is a new service worker waiting to be installed, notify user
        if (reg.waiting) {
            // TODO
        }

        // If there is a new service worker being installed, track it, and notify user on successful installed
        if (reg.installing) {
            // TODO
        }

        // Event fired when a new service worker is installing, track it's install, and notify user on successful install
        reg.addEventListener('updatefound', function () {
            // TODO
        });
    });
}