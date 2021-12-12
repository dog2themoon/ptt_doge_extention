
function reloadWindow() {
    reloadWindowAtDomain('*');
}

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

searchParticipant


let searchParticipantButton = document.getElementById("searchParticipant");
searchParticipantButton.addEventListener("click", () => {


    chrome.storage.sync.get("participant", ({ participant })=>{
        showUsersAddress(participant);
    } )
    
});


//test

// let queryOptions = { active: true, currentWindow: true };
// chrome.tabs.query(queryOptions, function (tabs) {

//     let tab = tabs[0];

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: () => {
            
//             let AllUsers = document.getElementsByClassName('push');
//             let AllUserID = [];
//             for (let i = 0; i < AllUsers.length; i++) {
//                 let user = AllUsers[i];
//                 let userID = user.getElementsByClassName('push-userid')[0].textContent;

//                 AllUserID.push(userID);
//             }
//             var NotRepeatingUserID = AllUserID.filter(function(item, index, array){
//                 return AllUserID.indexOf(item) === index;
//             });

//             console.log("NotRepeatingUserID");
//             console.log(NotRepeatingUserID);

//             let out_str = '';
//             NotRepeatingUserID.forEach((userID)=>{
//                 out_str = out_str + userID + ','
                
//             });
//             console.log(out_str)

//         }
//     });

// });
// 還要做一個多重發送的工具









// init 顯示地址簿
let addressPageURL = document.getElementById("addressPageURL");
chrome.storage.sync.get("pttURL", ({ pttURL }) => {
    addressPageURL.textContent = pttURL;
    addressPageURL.setAttribute("href", pttURL);
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
                reloadWindow();
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
    
    if(userList.length === 1) {
        userList = userID.split(' ');
    }

    let cleanUserList = userList.filter(function(str) { // 只篩選出非空字元的ID
        if(str !== '') {
            return str;
        }
    });
    

    showUsersAddress(cleanUserList);
})



function showUsersAddress(userList) {
    
    chrome.storage.sync.get("userAddress", ({ userAddress }) => {

        console.log("search: ", userList);

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



