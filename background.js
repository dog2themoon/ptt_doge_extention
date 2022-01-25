chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("isToolOpen", ({ isToolOpen })=>{
        if( isToolOpen === undefined) {
            chrome.storage.sync.set({ isToolOpen: true });
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ pttURL: 'https://www.ptt.cc/bbs/DigiCurrency/M.1639056719.A.024.html' });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("userAddress", ({ userAddress })=>{
        if( userAddress === undefined ) {
            chrome.storage.sync.set({ userAddress: {} });
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("participant", ({ participant })=>{
        if( participant === undefined ) {
            chrome.storage.sync.set({ participant: [] });
        }
    });
});

