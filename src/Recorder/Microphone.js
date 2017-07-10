var mediaRecorder;
var chunks = [];
var constraints = { audio: true };

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia)

function onSuccess(stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstop = function() {
    }
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
}
function onError(err) {
    console.log('The following error occured: ' + err);
}

function startRecord() {
    mediaRecorder.start();
}
function stopRecord() {
    return new Promise((resolve) => {
        mediaRecorder.stop();
        setTimeout(function() {
            let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = [];
            resolve(blob);
        })
    })    
}



export default function () {

    if (navigator.getUserMedia) {
        var constraints = { audio: true };

        navigator.getUserMedia(constraints, onSuccess, onError);
    }
    else {
        console.log('getUserMedia not supported on your browser!');
    }

    return {
        startRecord,
        stopRecord
    }
}