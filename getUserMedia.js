const temptracks = new MediaStream();

navigator.getUserMedia({ audio: true, video: true }, (micStream) => {
    console.log('got mic stream');
    console.log(micStream);

}, (micError) => {
    chrome.tabs.create({
        url: 'camera-mic.html'
    })
});