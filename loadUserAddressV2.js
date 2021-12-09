
// https://developer.chrome.com/docs/apps/app_external/#external


window.loadUserAddress = loadUserAddress;

function loadUserAddress(complete) {

    var xhr = new XMLHttpRequest();
    chrome.storage.sync.get("pttURL", ({ pttURL }) => {
    
        xhr.open('GET', pttURL, true); // `true` makes the request asynchronous
    
        xhr.onload = function (e) {
            let allUserAddress = {};
    
            // console.log(this.response);
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.response, "text/html");
    
            let AllUsers = doc.getElementsByClassName('push');
            for (let i = 0; i < AllUsers.length; i++) {
                let user = AllUsers[i];
                let userID = user.getElementsByClassName('push-userid')[0].textContent;
                let pushContent = user.getElementsByClassName('push-content')[0].textContent;
    
                let justLetters = pushContent.replace(/\s+/g, '').replace(/:/g, '');
                let isDogeAddress = WAValidator.validate(justLetters, 'DogeCoin');
                if (isDogeAddress) {
                    allUserAddress[userID] = justLetters;
                }
            }
    
            chrome.storage.sync.set({ userAddress: allUserAddress });
            // console.log(allUserAddress); // for debug test

            chrome.runtime.sendMessage('get-all-user-address', (response) => {

                if (!chrome.runtime.lastError) { // 必須要有這判斷 不然會有例外
                    // if you have any response
                } else {
                    // if you don't have any response it's ok but you should actually handle
                    // it and we are doing this when we are examining chrome.runtime.lastError
                }
            });


            complete();
    
        };
    
        xhr.send();
    
    });


}

