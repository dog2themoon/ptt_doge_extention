chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ isToolOpen: true });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ pttURL: 'https://www.ptt.cc/bbs/Test/M.1639022777.A.17A.html' });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ userAddress: {} });
});