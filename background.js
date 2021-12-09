chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ isToolOpen: true });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ pttURL: 'https://www.ptt.cc/bbs/DigiCurrency/M.1639056719.A.024.html' });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ userAddress: {} });
});