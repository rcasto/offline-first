import View from './video-gif.html';
import Helpers from '../../scripts/helpers.js';

const Template = Helpers.compileHtmlString(View).querySelector('.video-gif');

function animateFrames(canvas, frames, frameDelay, i = 0) {
    var canvasContext = canvas.getContext('2d');
    var numFrames = frames.length;
    var lastUpdate;
    var animateId;
    window.setTimeout(function _animLoop(time) {
        if (!lastUpdate || (time - lastUpdate) >= frameDelay) {
            canvasContext.putImageData(frames[i], 0, 0);

            i++;
            if (i >= numFrames) {
                i = 0;
            }

            lastUpdate = time;
        }
        animateId = window.requestAnimationFrame(_animLoop);   
    }, 0);
    return () => window.cancelAnimationFrame(animateId);
}

function doneSeeking(video) {
    return new Promise((resolve, reject) => {
        if (video.seeking) {
            video.addEventListener('seeked', function seek() {
                video.removeEventListener('seeked', seek);
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function fetchFrames(canvas, video, numFrames) {
    var canvasContext = canvas.getContext('2d');
    var skip = video.duration / (numFrames - 1);
    var results = [];
    return new Promise((resolve, reject) => {
        (function _fetch() {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

            results.push(canvasContext.getImageData(0, 0, canvas.width, canvas.height));

            numFrames--;
            video.currentTime += skip;

            doneSeeking(video).then(() => {
                if (numFrames <= 0) {
                    resolve(results);
                } else {
                    _fetch();
                }
            });
        }());
    });
}

class VideoGif extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // Create Shadow DOM and attach template clone
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(Template.content.cloneNode(true));

        var video = this.shadowRoot.querySelector('video');
        var canvas = this.shadowRoot.querySelector('canvas');
        var context = canvas.getContext('2d');
        var numImages = window.parseInt(this.getAttribute('data-frames'), 10);
        var frameDelay = window.parseInt(this.getAttribute('data-delay'), 10);
        var isVideoLoaded = false;
        var frames, cancel;

        video.src = this.getAttribute('data-url');

        video.addEventListener('canplaythrough', () => {
            if (!isVideoLoaded) {
                fetchFrames(canvas, video, numImages).then((_frames) => {
                    frames = _frames;
                    context.putImageData(frames[0], 0, 0);
                    canvas.hidden = false;
                });
                isVideoLoaded = true;
            }
        }, false);
        video.addEventListener('error', (error) => console.error(JSON.stringify(error)), false);

        this.addEventListener('mouseover', () => {
            console.log('Moused over');
            if (frames) {
                cancel = animateFrames(canvas, frames, frameDelay);
            }
        }, false);
        this.addEventListener('mouseout', () => {
            console.log('Moused out');
            if (cancel) {
                cancel();
                cancel = null;
            }
        }, false);
        // this.addEventListener('touchstart', () => {
        //     console.log('Touch start');
        //     if (cancel) {
        //         cancel();
        //         cancel = null;
        //     } else {
        //         cancel = animateFrames(canvas, frames, frameDelay);
        //     }
        // }, false);
    }
}

export default VideoGif;