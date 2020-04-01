var runtimePort;
const extID = "fpfapkmnlemhleffghobhebjlpffeenh";
var mainMediaRecorder = null;
var mediaStreams = [];
var pedacos = [];

function startRecording() {
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'audio'], (chromeMediaSourceId, opts) => {

        getAudioTracks(chromeMediaSourceId).then(mediaStream => {

            console.log(mediaStream.getTracks());

            mainMediaRecorder = new MediaRecorder(mediaStream);

            mainMediaRecorder.ondataavailable = (event) => {
                console.log('pedaço de audio');
                console.log(event);
                pedacos.push(event.data)
            }

            mainMediaRecorder.onstop = () => {
                console.log('recording stopped');
                console.log(pedacos);
                const blob = new Blob(pedacos, {'type': 'audio/ogg; codecs=opus'});
                console.log(blob);
                const url = URL.createObjectURL(blob);

                chrome.downloads.download({
                    url: url
                })

                runtimePort.postMessage({
                    fileDownload: true,
                    url: url
                });
            }

            mainMediaRecorder.start();
        });
    });
}

function stopRecording() {
    mainMediaRecorder.stop();
}

function getAudioTracks(chromeMediaSourceId) {
    const constraints = {
        audio: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId
            }
        },
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId
            },
            optional: []
        }
    }

    return new Promise(async (resolve, reject) => {

        const mediaStream = new MediaStream();

        const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
        const audioStreams = await navigator.mediaDevices.getUserMedia(constraints);

        mediaStreams.push(micStream);
        mediaStreams.push(audioStreams);

        console.log(audioStreams.getTracks());
        console.log(micStream.getAudioTracks());

        audioStreams.getAudioTracks().forEach(track => {
            mediaStream.addTrack(track);
        });

        micStream.getTracks().forEach(track => {
            mediaStream.addTrack(track);
        });

        micStream.oninactive = function () {
            mainMediaRecorder.stop();
        }

        audioStreams.oninactive = function () {
            mainMediaRecorder.stop();
        }

        resolve(getMixedAudioStreams(mediaStream));
    });
}

function getMixedAudioStreams(mediaStream) {
    const ac = new AudioContext();
    const dest = ac.createMediaStreamDestination();
    mediaStream.getTracks().forEach(tra => {
        const source = ac.createMediaStreamSource(new MediaStream([tra]));
        source.connect(dest);
    });
    return dest.stream;
}
