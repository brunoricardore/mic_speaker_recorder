var runtimePort = chrome.runtime.connect({
    name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});


document.getElementById('startRecorder').addEventListener('click', recordClick, false);

document.getElementById('stopRecorder').addEventListener('click', stopRecorder, false);

function stopRecorder() {
    runtimePort.postMessage({
        stopRecording: true
    })
}

function recordClick() {

    const downloadBtn = document.getElementById('baixarArquivo');

    runtimePort.postMessage({
        startRecording: true
    })

    runtimePort.onMessage.addListener(function (message) {

        if (message.fileDownload) {
            console.log(message);
            downloadBtn.src = encodeURI(message.url);
            downloadBtn.download = 'audio.ogg';
            downloadBtn.click();
        }
    });


    // chrome.desktopCapture.chooseDesktopMedia(['screen', 'audio'], function (chromeMediaSourceId, opts) {


    // let constraints = {
    //     audio: false,
    //     video: {
    //         mandatory: {
    //             chromeMediaSource: 'desktop',
    //             chromeMediaSourceId: chromeMediaSourceId
    //         },
    //         optional: []
    //     }
    // };

    // if (opts.canRequestAudioTrack) {
    //     constraints.audio = {
    //         mandatory: {
    //             chromeMediaSource: 'desktop',
    //             chromeMediaSourceId: chromeMediaSourceId
    //         }
    //     }
    // } else {
    //     alert('Vocẽ deve ativar a opção compartilhar audio para este recurso funcionar!');
    // }


    // navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => {

    //     const videoInput = document.getElementById('screenMain');
    //     const downloadBtn = document.getElementById('baixarArquivo');

    //     let newStream = new MediaStream();
    //     let buckets = [];

    //     // navigator.getUserMedia({audio: true, video: true}, (micStream) => {
    //     //     console.log('got mic stream');
    //     //     console.log(micStream);

    //     // }, (micError) => {
    //     //     chrome.tabs.create({
    //     //         url: 'camera-mic.html'
    //     //     })
    //     // });


    //     if (stream.getAudioTracks().length > 0) {
    //         stream.getAudioTracks().forEach((track) => {
    //             newStream.addTrack(track);
    //         });

    //         let mediaRecorder = new MediaRecorder(newStream);

    //         mediaRecorder.ondataavailable = (event) => {
    //             console.log('audio bucket avaliable');
    //             console.log(event);
    //             buckets.push(event.data);
    //         }

    //         mediaRecorder.onstop = () => {
    //             try {
    //                 console.log(buckets);
    //                 // const blob = new Blob(buckets, {'type': 'audio/ogg; codecs=opus'});
    //                 let blob = new Blob(buckets, { type: 'audio/ogg' });
    //                 downloadBtn.href = URL.createObjectURL(blob);
    //                 downloadBtn.download = 'audio.ogg';
    //                 downloadBtn.click();
    //                 console.log('ready for download');
    //                 buckets = [];
    //             } catch (e) {
    //                 console.log(e);

    //             }
    //         }

    //         mediaRecorder.start();

    //         stream.oninactive = function () {
    //             mediaRecorder.stop();
    //         }

    //     }

    // })

    // });

}
