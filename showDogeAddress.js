
// 依賴 addQrcode.js

window.showDogeAddress = showDogeAddress;

function showDogeAddress() {
    let AllUsers = document.getElementsByClassName('push');
    let userPushTag = AllUsers[0].getElementsByClassName('push-tag')[0];
    let dogeImgSize = Math.floor(userPushTag.clientWidth * 0.7);


    for (let i = 0; i < AllUsers.length; i++) {
        let user = AllUsers[i];
        // console.log(user);

        let userPushTag = user.getElementsByClassName('push-tag')[0];
        let userID = user.getElementsByClassName('push-userid')[0];

        chrome.storage.sync.get("userAddress", ({ userAddress }) => {

            let dogeAddress = userAddress[userID.textContent];
            if (dogeAddress) {


                var dogecoinDIV = document.createElement("div");
                var dogecoinImg = document.createElement("img");

                let dogecoinImgID = dogeAddress + "-img-" + i;
                dogecoinImg.setAttribute("id", dogecoinImgID);
                

                dogecoinImg.setAttribute("width", dogeImgSize);
                dogecoinImg.setAttribute("height", dogeImgSize);

                var dogeImgURL = chrome.runtime.getURL("images/dogecoin.png");
                dogecoinImg.setAttribute("src", dogeImgURL);


                dogecoinDIV.appendChild(dogecoinImg);
                dogecoinImg.style.cssText = "position: absolute;left: 0px;bottom: 0px";
                userPushTag.textContent = '';
                userPushTag.appendChild(dogecoinDIV);
               
                window.addQrcode(dogecoinImgID, dogeAddress); // Todo 還需要多一個確認
            }
        });
    }
}