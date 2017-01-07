// Register service worker if browser supports it
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        // Page not currently controlled by service worker, by default will have latest
        if (!navigator.serviceWorker.controller) {
            return;
        }

        // If there is a new service worker waiting to be installed, notify user
        if (reg.waiting) {
            // TODO
        }

        // If there is a new service worker being installed, track it, and notify user on successful install
        if (reg.installing) {
            // TODO
        }

        // Event fired when a new service worker is installing, track it's install, and notify user on successful install
        reg.addEventListener('updatefound', function () {
            // TODO
        });
    });

    // Refresh the page if the controlling service worker changes to refresh cache assets
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
    });
}

import blah from './foo.js';

console.log('test val:', blah);