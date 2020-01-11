chrome.runtime.onMessage.addListener(request => {
  chrome.contextMenus.removeAll(() => {
    if(request.event === 'createContextMenuItem') {
      if(!chrome.contextMenus.onClicked.hasListeners()) {
        chrome.contextMenus.onClicked.addListener((info, tab) => openVideoNewTab(info, tab, request.videoId));
      }

      chrome.contextMenus.create({
        title: 'Download reddit video',
        id: 'parent'
      });
    }
  });
});

function openVideoNewTab(info, tab, videoId) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      downloadVideo: true, videoId: videoId
    });
  });
}
