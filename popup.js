
function reloadWindow() {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, function (tabs) {
        let tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                window.location.reload();
            }
        });
    });

}

function reloadWindowJustRunInPtt() {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, function (tabs) {

        var activeTab = tabs[0];
        let domain = (new URL(activeTab.url)).hostname;

        if (domain === 'www.ptt.cc') {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: () => {
                    window.location.reload();
                }
            });
        }
        
    });

}


let addressPageURL = document.getElementById("addressPageURL");

// init
chrome.storage.sync.get("pttURL", ({ pttURL }) => {
    addressPageURL.textContent = pttURL;
    addressPageURL.setAttribute("href", pttURL);
});

let isToolOpenSwitch = document.getElementById("isToolOpenSwitch");

chrome.storage.sync.get("isToolOpen", ({ isToolOpen }) => {
    if (isToolOpen) {
        isToolOpenSwitch.checked = true;
    } else {
        isToolOpenSwitch.checked = false;
    }
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
        showAddressBookPeopleNum.textContent = '[登記人數: ' + peopleNum + ' ]';
    });
}

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
            reloadWindow();
        });
        
    }

});





let loadAddressButton = document.getElementById("loadAddressButton");

loadAddressButton.addEventListener("click", async () => {

    let addressPage = document.getElementById("addressPage");
    let addressPageValue = addressPage.value;
    if (addressPageValue != '') {
        addressPageURL.textContent = addressPageValue;
        chrome.storage.sync.set({ pttURL: addressPageValue });
        addressPage.value = '';
        chrome.storage.sync.set({ userAddress: {} });
        reloadWindowJustRunInPtt(); // 防止在其它 domain 無效
    }

    window.location.reload();
});



isToolOpenSwitch.addEventListener("click", () => {
    if (isToolOpenSwitch.checked == false) {
        chrome.storage.sync.set({ isToolOpen: false });
        reloadWindow();
    } else {
        chrome.storage.sync.set({ isToolOpen: true });
        reloadWindow();
    }
})


let searchAddressButton = document.getElementById("searchAddressButton");
searchAddressButton.addEventListener("click", () => {

    let userID = document.getElementById("userID").value;

    chrome.storage.sync.get("userAddress", ({ userAddress }) => {

        var userAry = userID.split(',');
        console.log(userAry);

        // init 欄位
        $("#usersAddress>thead").empty();
        $("#usersAddress>tbody").empty();



        let needShowFirstThead = true;
        userAry.forEach((id, index) => {


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

})



