const videos = document.querySelectorAll('[id^=media-preview]');

document.addEventListener('mousedown', () => {
  chrome.runtime.sendMessage({ event: 'removeContextMenuItem' });
});

videos.forEach(video => {
  video.addEventListener('mousedown', event => {
    chrome.runtime.sendMessage({ 
      event: 'createContextMenuItem',
      videoId: video.id
    });
  }, true);
});

chrome.runtime.onMessage.addListener(request => {
  if(request.downloadVideo && request.videoId) {
    // const fileName = `${request.videoId}.webm`;
    const videoId = request.videoId.replace('media-preview-', '');

    const videoRoot = document.getElementById(`video-${videoId}`);
    const dataMpdUrl = videoRoot.getAttribute('data-mpd-url');

    fetch(dataMpdUrl, {
      'Content-Type': 'text/xml; charset=utf-8',
      'Accept-Encoding': 'gzip, deflate'
    })
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then(data => {
        const dataMpdPlaylist = JSON.parse(xml2json(data, ''));

        // TODO: retrieve largest video src; naively assumes first option is largest video
        const baseURL = dataMpdPlaylist.MPD.Period.AdaptationSet[0] ?
          dataMpdPlaylist.MPD.Period.AdaptationSet[0].Representation[0].BaseURL :
          dataMpdPlaylist.MPD.Period.AdaptationSet.Representation[0].BaseURL;
        const videoUrl = `${dataMpdUrl.replace('/DASHPlaylist.mpd', '')}/${baseURL}`;
        
        // TODO: engage download instead of opening video in new tab (which allows right-click save on video so solution works for now)
        window.open(videoUrl, '_blank').focus();
      })
      .catch(console.error);
  }
});

// TODO: setup download retrieved from fetched video url data
function downloadVideoFile(data = { test: 'hello world'}, fileName = 'test.json') {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';

  const json = JSON.stringify({ test: 'hello world' });
  const blob = new Blob([json], {type: "octet/stream"});
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
