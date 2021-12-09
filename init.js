
chrome.storage.sync.get("isToolOpen", ({ isToolOpen }) => {
    if(isToolOpen) {
        window.loadUserAddress(()=>{
            window.showDogeAddress();
        })
    }
});


