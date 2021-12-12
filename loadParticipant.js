
window.loadParticipant = loadParticipant;

function loadParticipant() {
    let AllUsers = document.getElementsByClassName('push');
    let AllUserID = [];
    for (let i = 0; i < AllUsers.length; i++) {
        let user = AllUsers[i];
        let userID = user.getElementsByClassName('push-userid')[0].textContent;
    
        AllUserID.push(userID);
    }
    
    let NotRepeatingUserID = AllUserID.filter(function(item, index, array){
        return AllUserID.indexOf(item) === index;
    });
    
    let participant = NotRepeatingUserID;
    
    chrome.storage.sync.set({ participant: participant });
}


