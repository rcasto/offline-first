import Toast from '../components/toast/toast.js';

var updateMessage = 'New version available';
var updateAction = 'Reload to update';

var toastContainer = document.querySelector('.toast-container');

// Register service worker if browser supports it
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        // Page not currently controlled by service worker, by default will have latest
        if (!navigator.serviceWorker.controller) {
            return;
        }

        // If there is a new service worker waiting to be installed, notify user
        if (reg.waiting) {
            updateReady(reg.waiting);
            return;
        }

        // If there is a new service worker being installed, track it, and notify user on successful install
        if (reg.installing) {
            trackInstall(reg.installing).then(updateReady);
            return;
        }

        // Event fired when a new service worker is installing, track it's install, and notify user on successful install
        reg.addEventListener('updatefound', function () {
            trackInstall(reg.installing).then(updateReady);
        });
    });
    
    // Refresh the page if the controlling service worker changes to refresh cache assets
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        console.log('Controlling service worker changed');
        window.location.reload();
    });
}

function trackInstall(worker) {
    return new Promise((resolve, reject) => {
        worker.addEventListener('statechange', () => {
            if (worker.state === 'installed') {
                resolve(worker);
            }
        });
    });
}

function updateReady(worker) {
    var toast = createToast(updateMessage, updateAction);
    toast.addEventListener('toast-action', () => {
        console.log('Toast action was invoked');
        worker.postMessage({
            action: 'skipWaiting'
        });
    });
    toastContainer.appendChild(toast);
}

// Make a container element to store toasts in
function createToast(message, action) {
    var toastElem = document.createElement('toast-notification');
    toastElem.setAttribute('data-message', message);
    toastElem.setAttribute('data-action', action);
    return toastElem;
}

// Register the toast notification, if supported
if (window.customElements && window.customElements.define) {
    window.customElements.define('toast-notification', Toast);
}