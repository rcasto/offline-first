function onError(error) {
    console.error(JSON.stringify(error));
}

function mergeDataChunks(chunks, chunk) {
    var tmp = new Uint8Array(chunks.length + chunk.length);
    tmp.set(chunks);
    tmp.set(chunk, chunks.length);
    return tmp;
}

function chunksToObjectUrl(chunks, mime) {
    var blob = new Blob(chunks, {
        type: mime
    });
    return window.URL.createObjectURL(blob);
}

function captureVideoFrame(url) {
    return loadVideo(url).then(drawAndGrabVideoFrame);
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
            console.log('Video loaded');
            video.removeEventListener('loadeddata', load);
            video.removeEventListener('error', onError);
            resolve(video);
        });
        video.addEventListener('error', onError);
    });
}

function doneSeeking(video) {
    return new Promise((resolve, reject) => {
        if (video.seeking) {
            video.addEventListener('seeked', function seek() {
                console.log('Video done seeking');
                video.removeEventListener('seeked', seek);
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function createPreview(frames) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    // initialize
    context.putImageData(frames[0], 0, 0);

    // Add animate handlers
    canvas.addEventListener('mouseover', () => {

    });
    canvas.addEventListener('mouseout', () => {

    });

    return canvas;
}

fetch('/images/test-video.mp4')
    .then(function (response) {
        var contentLength = Number.parseInt(response.headers.get('Content-Length'), 10);
        var reader = response.body.getReader();

        var frames = [];
        var videoData = new Uint8Array();
        var numFrames = 12;
        var bytesRead = 0;
        var bytesPerFrame = contentLength / numFrames
        var percentDone;
        var currentFrame = 1;
    
        console.log('Starting to read stream:', bytesPerFrame);

        reader.read().then(function readChunk(chunk) {
            if (chunk.done) {
                console.log('Finished reading stream', bytesRead, bytesPerFrame * numFrames, currentFrame);
                return;
            }

            bytesRead += chunk.value.byteLength;
            percentDone = (bytesRead / contentLength) * 100;
            videoData = mergeDataChunks(videoData, chunk.value);

            var start = 0;
            if (videoData.length > currentFrame * bytesPerFrame) {
                console.log('Process the frame..man');
                let end = start + bytesPerFrame;
                let i = currentFrame;
                captureVideoFrame(
                    chunksToObjectUrl([videoData.slice(start, end)])
                ).then((frame) => {
                    console.log('Frame data:', frame);
                    frames.push({
                        i: i,
                        frame: frame
                    });
                    if (i >= numFrames - 1) {
                        console.log('job done');
                        let preview = createPreview(frames.sort((a, b) => {
                            return a.i - b.i;
                        }).map((obj) => {
                            return obj.frame;
                        }));
                        document.body.appendChild(preview);
                    }
                });
                currentFrame++;
                start += bytesPerFrame;
            }

            reader.read().then(readChunk, onError);
        }, onError);
    }, onError);