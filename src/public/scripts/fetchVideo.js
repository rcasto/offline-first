function onError(error) {
    console.error(JSON.stringify(error));
}

function mergeDataChunks(chunks, chunk, start) {
    chunks.set(chunk, start);
    return chunks;
}

function chunksToObjectUrl(chunks, mime) {
    var blob = new Blob(chunks, {
        type: mime
    });
    return window.URL.createObjectURL(blob);
}

function captureVideoFrame(video, time) {
    return seekTo(video, time).then(drawAndGrabVideoFrame);
}

function collectFrames(numFrames) {
    var frames = [];
    return function (frame) {
        return new Promise((resolve, reject) => {
            frames.push({
                i: i,
                frame: frame
            });
            numFrames--;
            if (numFrames <= 0) {
                let preview = createPreview(frames.sort((a, b) => {
                    return a.i - b.i;
                }).map((obj) => {
                    return obj.frame;
                }), 400);
                resolve(preview);
            }
        });
    };
}

function drawAndGrabVideoFrame(video) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return context.getImageData(0, 0, canvas.width, canvas.height)
}

function loadVideo(url) {
    return new Promise((resolve, reject) => {
        var video = document.createElement('video');
        video.src = url;
        video.addEventListener('loadeddata', function load() {
            video.removeEventListener('loadeddata', load);
            video.removeEventListener('error', onError);
            resolve(video);
        });
        video.addEventListener('error', onError);
    });
}

function seekTo(video, time) {
    return new Promise((resolve, reject) => {
        video.currentTime = time;
        if (video.seeking) {
            video.addEventListener('seeked', function seek() {
                video.removeEventListener('seeked', seek);
                resolve(video);
            });
        } else {
            resolve(video);
        }
    });
}

function createPreview(frames, frameDelay) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var currentFrame = 0;
    var animateId;

    // initialize
    context.putImageData(frames[currentFrame], 0, 0);

    // Add animate handlers
    canvas.addEventListener('mouseover', () => {
        var lastUpdate;
        animateId = window.requestAnimationFrame(function _anim(time) {
            if (!lastUpdate || time - lastUpdate > frameDelay) {
                if (currentFrame + 1 >= frames.length) {
                    currentFrame = 0;
                } else {
                    currentFrame++;
                }
                context.putImageData(frames[currentFrame], 0, 0);
                lastUpdate = time;
            }
            animateId = window.requestAnimationFrame(_anim);
        });
    });
    canvas.addEventListener('mouseout', () => {
        window.cancelAnimationFrame(animateId);
    });

    return canvas;
}

fetch('/images/test-video.mp4')
    .then(function (response) {
        var contentLength = Number.parseInt(response.headers.get('Content-Length'), 10);
        var reader = response.body.getReader();

        var videoData = new Uint8Array(contentLength);
        var frames = [];
        var numFrames = 12;
        var bytesPerFrame = Math.floor(contentLength / numFrames);
        var frameRatio = bytesPerFrame / contentLength;
        var currentFrame = 0;
        var bytesRead = 0;

        reader.read().then(function readChunk(chunk) {
            if (chunk.done) {
                return;
            }

            videoData = mergeDataChunks(videoData, chunk.value, bytesRead);
            bytesRead += chunk.value.byteLength;

            if (bytesRead >= (currentFrame + 1) * bytesPerFrame) {
                let i = currentFrame;
                let url = chunksToObjectUrl([videoData.slice(0, bytesRead)], 'video/mp4');

                loadVideo(url)
                    .then((video) => {
                        var time = frameRatio * video.duration * i;
                        return captureVideoFrame(video, time);
                    })
                    .then((frame) => {
                        window.URL.revokeObjectURL(url);
                        frames.push({
                            i: i,
                            frame: frame
                        });
                        if (i >= numFrames - 1) {
                            let preview = createPreview(frames.sort((a, b) => {
                                return a.i - b.i;
                            }).map((obj) => {
                                return obj.frame;
                            }), 400);
                            document.body.appendChild(preview);
                        }
                    })
                    .catch(onError);
                currentFrame++;
            }

            reader.read().then(readChunk, onError);
        }, onError);
    }, onError);