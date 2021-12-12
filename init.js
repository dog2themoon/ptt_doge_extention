
chrome.storage.sync.get("isToolOpen", ({ isToolOpen }) => {
    window.loadParticipant();
    
    if(isToolOpen) {
        window.loadUserAddress(()=>{
            window.showDogeAddress();
        });
    }
});


