chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { downloadVideo: true });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Download reddit video',
    id: 'parent'
  });
});
