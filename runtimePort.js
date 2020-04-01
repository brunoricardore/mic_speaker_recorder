chrome.runtime.onConnect.addListener(function (port) {
    runtimePort = port;

    runtimePort.onMessage.addListener(function (message) {

        if (message.startRecording) {
            
            startRecording();

        }

        if (message.stopRecording) {
            stopRecording();
        }
    });
});
