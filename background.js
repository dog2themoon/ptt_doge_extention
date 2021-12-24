chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("isToolOpen", ({ isToolOpen })=>{
        if(typeof isToolOpen === undefined) {
            chrome.storage.sync.set({ isToolOpen: true });
        }
    });
    
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ pttURL: 'https://www.ptt.cc/bbs/DigiCurrency/M.1639056719.A.024.html' });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("userAddress", ({ userAddress })=>{
        if(typeof userAddress === undefined) {
            chrome.storage.sync.set({ userAddress: {} });
        }
    });
});