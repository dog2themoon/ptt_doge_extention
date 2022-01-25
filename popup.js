function reloadWindowJustRunInPtt() {
    reloadWindowAtDomain('www.ptt.cc');
}

function reloadWindowAtDomain(allowDomain) { // if allowDomain === *, is always reload
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, function (tabs) {

        let tab = tabs[0];
        let domain = (new URL(tab.url)).hostname;

        if (allowDomain === '*' || domain === allowDomain) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    window.location.reload();
                }
            });
        }

    });

}

// init 顯示地址簿
let addressPageURL = document.getElementById("addressPageURL");
chrome.storage.sync.get("pttURL", ({ pttURL }) => {
    
    addressPageURL.setAttribute("href", pttURL);

    let url = pttURL.replace(/^https:\/\//, '');
    addressPageURL.textContent = url;

});

// 顯示標註開關
let isToolOpenSwitch = document.getElementById("isToolOpenSwitch");
chrome.storage.sync.get("isToolOpen", ({ isToolOpen }) => {
    if (isToolOpen) {
        isToolOpenSwitch.checked = true;
    } else {
        isToolOpenSwitch.checked = false;
    }
});

// 加上隨機抽20位參與者功能
let random20ParticipantButton = document.getElementById("random20Participant");
random20ParticipantButton.addEventListener("click", () => {
    chrome.storage.sync.get("participant", ({ participant }) => {

        chrome.storage.sync.get("userAddress", ({ userAddress })=>{
            let registeredParticipant = [];
            registeredParticipant = participant.filter( user => userAddress[user]);
            randomParticipant = shuffle(registeredParticipant);

            showUsersAddress(randomParticipant.slice(0,20));
        });
        
    })
});


function shuffle(array) {
    let newArray =  Array.from(array);

    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 加上搜尋所有參與者功能
let searchParticipantButton = document.getElementById("searchParticipant");
searchParticipantButton.addEventListener("click", () => {
    chrome.storage.sync.get("participant", ({ participant }) => {

        chrome.storage.sync.get("userAddress", ({ userAddress })=>{
            let registeredParticipant = [];
            registeredParticipant = participant.filter( user => userAddress[user]);
            showUsersAddress(registeredParticipant);
        });

    })
});

// 加上搜尋上次紀錄的功能
let showLastSearchButton = document.getElementById("showLastSearch");
showLastSearchButton.addEventListener("click", () => {
    chrome.storage.sync.get("lastSearchUsers", ({ lastSearchUsers }) => {
        if( lastSearchUsers ) {
            showUsersAddress(lastSearchUsers);
        }
    })
});

// 加上下載所有參與者功能
let downloadParticipantJson = document.getElementById("downloadParticipantJson");

chrome.storage.sync.get("participant", ({ participant }) => {

    chrome.storage.sync.get("userAddress", ({ userAddress })=>{

        let userAndAddressList = [];

        for(let i = 0 ; i < participant.length ; i++) {

            let userID = participant[i];
            let address = userAddress[userID];
            if(address) {
                userAndAddressList.push( [userID, address ] );
            } else {
                userAndAddressList.push( [userID, "notRegister" ] );
            }
            
        }

        let content = JSON.stringify(userAndAddressList);

        const file = new Blob([content], { type: "text/plain" });
        downloadParticipantJson.href = URL.createObjectURL(file);

        let fileName = "participant.json";
        downloadParticipantJson.download = fileName;

    });
});

updateAddressBookPeople();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // 在重載地址簿時也會重新計算
    if (message === 'get-all-user-address') {
        updateAddressBookPeople();
    }
});

function updateAddressBookPeople() {
    let showAddressBookPeopleNum = document.getElementById("showAddressBookPeopleNum");
    chrome.storage.sync.get("userAddress", ({ userAddress }) => {
        let peopleNum = Object.keys(userAddress).length;
        showAddressBookPeopleNum.textContent = '[登記人數: ' + peopleNum + ']';
    });
}

showUpdateAddressBookLink();
function showUpdateAddressBookLink() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        var activeTab = tabs[0];
        let domain = (new URL(activeTab.url)).hostname;

        let updateAddressBook = document.getElementById("updateAddressBook");

        if (domain !== 'www.ptt.cc') {
            updateAddressBook.textContent = "跳轉更新"
            chrome.storage.sync.get("pttURL", ({ pttURL }) => {
                updateAddressBook.setAttribute("href", pttURL);
                updateAddressBook.setAttribute('target', '_blank');
            });

        } else {
            updateAddressBook.textContent = "更新"
            updateAddressBook.addEventListener("click", () => {
                reloadWindowJustRunInPtt();
            });
        }
    });
}



let loadAddressButton = document.getElementById("loadAddressButton");
loadAddressButton.addEventListener("click", async () => {

    let addressPage = document.getElementById("addressPage");
    let addressPageValue = addressPage.value;

    addressPageValue = addressPageValue.replace(/\s+/g, '');// 清除空白

    if (addressPageValue != '') {
        addressPageURL.textContent = addressPageValue;
        chrome.storage.sync.set({ pttURL: addressPageValue });
        addressPage.value = '';
        chrome.storage.sync.set({ userAddress: {} });
        reloadWindowJustRunInPtt(); // 防止在其它 domain 無效

        window.location.reload(); // 自身重載 會觸發計算登記人數
    }
});



isToolOpenSwitch.addEventListener("click", () => {
    if (isToolOpenSwitch.checked == false) {
        chrome.storage.sync.set({ isToolOpen: false });
        reloadWindowJustRunInPtt();
    } else {
        chrome.storage.sync.set({ isToolOpen: true });
        reloadWindowJustRunInPtt();
    }
})


let searchAddressButton = document.getElementById("searchAddressButton");
searchAddressButton.addEventListener("click", () => { // 允許用逗號或空白分割多使用者

    let userID = document.getElementById("userID").value;
    let userList = userID.split(',');

    if (userList.length === 1) {
        userList = userID.split(' ');
    }

    let cleanUserList = userList.filter(function (str) { // 只篩選出非空字元的ID
        if (str !== '') {
            return str;
        }
    });


    showUsersAddress(cleanUserList);
})



function showUsersAddress(userList) {

    if(userList || userList.length > 0) { // save search users
        chrome.storage.sync.set({ lastSearchUsers: userList });
    }

    chrome.storage.sync.get("userAddress", ({ userAddress }) => {

        // init 欄位
        $("#usersAddress>thead").empty();
        $("#usersAddress>tbody").empty();


        let needShowFirstThead = true;
        userList.forEach((id, index) => {


            id = id.replace(/\s+/g, '');// 清除空白
            if (id == '') {
                return false; // continue;
            }

            if (needShowFirstThead) { // 顯示表格頭
                $("#usersAddress>thead").append('\
                <tr>\
                    <th scope="col-1">#</th>\
                    <th scope="col-2">帳號</th>\
                    <th scope="col-7">地址</th>\
                </tr>');
                needShowFirstThead = false;
            }

            let address = userAddress[id];

            let thNumStr = '<th scope="row">' + (index + 1) + '</th>';
            let userIDStr = '<td>' + id + '</td>';

            if (address) {

                let userAddressElementID = address + "-img-" + index

                let qrcodeElement = '<span><img id=' + userAddressElementID + ' src="images/qr-code.png" style="height:1.5rem;"></img></span>'
                let addressStr = '<td>' + '<p>' + address + '&nbsp;&nbsp;&nbsp;' + qrcodeElement + '</p>' + '</td>';

                $("#usersAddress>tbody").append('<tr>' + thNumStr + userIDStr + addressStr + '/<tr>');

                window.addQrcode(userAddressElementID, address);

            } else {

                let notFound = '<td>' + '此帳號未登記在地址簿' + '</td>';
                $("#usersAddress>tbody").append('<tr>' + thNumStr + userIDStr + notFound + '/<tr>');
            }

        });

    });

}



