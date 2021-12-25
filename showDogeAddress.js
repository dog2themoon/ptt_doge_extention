
// 依賴 addQrcode.js

window.showDogeAddress = showDogeAddress;


function showDogeAddress() {

    showAddressOnBoard();

    if ($(".article-meta-value").length === 0) { // Not in article page
        return;
    }

    let authorID = $(".article-meta-value")[0].textContent; // Todo 需要加檢查
    authorID = authorID.split(' ')[0];

    let dogeImgURL = chrome.runtime.getURL("images/dogecoin.png");

    chrome.storage.sync.get("userAddress", ({ userAddress }) => {

        let dogeAddress = userAddress[authorID];


        if (dogeAddress) {
            var dogecoinSpan = document.createElement("span");
            var dogecoinImg = document.createElement("img");

            let dogecoinImgID = dogeAddress + "-imgAuthor";
            dogecoinImg.setAttribute("id", dogecoinImgID);

            dogecoinImg.setAttribute("src", dogeImgURL);

            dogecoinSpan.appendChild(dogecoinImg);
            dogecoinImg.style.cssText = "width:1rem";

            $(".article-metaline")[0].appendChild(dogecoinSpan);

            window.addQrcodeOnBottomRightCorner(dogecoinImgID, dogeAddress); // Todo 還需要多一個確認
        }

    }
    )








    let AllUsers = document.getElementsByClassName('push');
    let userPushTag = AllUsers[0].getElementsByClassName('push-tag')[0];
    let dogeImgSize = Math.floor(userPushTag.clientWidth * 0.6);

    chrome.storage.sync.get("userAddress", ({ userAddress }) => {

        for (let i = 0; i < AllUsers.length; i++) {
            let user = AllUsers[i];


            // 設定圖示出現位置. 為了版面整齊, 所以都一律放圖示
            let dogecoinSpan = document.createElement("span");
            let dogecoinImg = document.createElement("img");

            dogecoinImg.setAttribute("width", dogeImgSize);
            dogecoinImg.setAttribute("height", dogeImgSize);

            dogecoinImg.setAttribute("src", dogeImgURL);
            dogecoinSpan.setAttribute("class", "h1");
            dogecoinImg.style.cssText = "position: relative;top: 0.2rem;" // for 置中
            dogecoinSpan.appendChild(dogecoinImg);
            user.insertBefore(dogecoinSpan, user.firstChild);


            let userIDElement = user.getElementsByClassName('push-userid');
            let userID = '';
            if (userIDElement.length > 0) {
                userID = userIDElement[0].textContent;
            }

            let dogeAddress = userAddress[userID];
            if (dogeAddress) {

                let dogecoinImgID = dogeAddress + "-img-" + i;
                dogecoinImg.setAttribute("id", dogecoinImgID);

                window.addQrcode(dogecoinImgID, dogeAddress); // Todo 還需要多一個確認

            } else {
                dogecoinImg.style.cssText = "visibility:hidden;";
            }


        }
    });

}

function showAddressOnBoard() {
    let boardAuthor = $('.r-ent > .meta > .author');
    if (boardAuthor.length === 0) { // is not exist
        return;
    }

    let dogeImgURL = chrome.runtime.getURL("images/dogecoin.png");

    chrome.storage.sync.get("userAddress", ({ userAddress }) => {

        for (let i = 0; i < boardAuthor.length; i++) {

            let author = boardAuthor[i];
            let authorID = author.textContent;


            let dogeAddress = userAddress[authorID];

            if (dogeAddress) {
                var dogecoinSpan = document.createElement("span");
                var dogecoinImg = document.createElement("img");

                let dogecoinImgID = dogeAddress + "-imgAuthor-" + i;
                dogecoinImg.setAttribute("id", dogecoinImgID);
                dogecoinImg.setAttribute("src", dogeImgURL);


                dogecoinSpan.appendChild(dogecoinImg);
                dogecoinImg.style.cssText = "width:1rem";

                author.insertBefore(dogecoinSpan, author.firstChild);

                window.addQrcode(dogecoinImgID, dogeAddress); // Todo 還需要多一個確認
            }
        }
    });

}