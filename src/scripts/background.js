var tb = {}, //global namespace for application, short for train buddy
    d = document;
tb.contacts = {};
tb.journeyDetails = {};



/*
@desc: function augmentation to global object for activating current view, function is called in various click events to show expected view
*/
tb.activateCurrentView = function (currentView, currentTab) {
    var allTabs = ["passengerContactsControl", "prepareTatkalControl", "addPassengerControl", "appPreferencesControl"];
    d.getElementById(currentTab).style.backgroundColor = 'rgb(0, 103, 128)';
    allTabs.splice(allTabs.indexOf(currentTab), 1);
    while (allTabs.length) {
        d.getElementById(allTabs.pop()).style.backgroundColor = '';
    }
    var nodes = d.getElementById("detailedViewContainer").childNodes;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.id != currentView) {
            childnodes = node.childNodes;
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }
    }
};

tb.contactForm = function (mainNode) {
    var formNode = d.createElement("form"),
        formcontent = "<table>" +
        "<tr><td><span>Name  : </span><input type = 'text' id = 'pFName' required/><input type = 'text' id = 'pLName' required/></td></tr>" +
        "<tr><td><span>Age : </span><input type='text' id='pAge'/></td></tr>" +
        "<tr><td><span>Gender : </span><select id='gender'><option name='gender' value='default'>Select</option><option name = 'gender'value = 'male'> Male </option><option name='gender' value='female'>Female</option ></select></td ></tr>" +
        "<tr><td><span>Berth Preference : </span><select id='berthPref'><option name='berthPref' value='default'> Select </option><option name='berthPref' value='lower'>Lower</option ><option name = 'berthPref'value = 'upper'> Upper </option></select></td></tr>" + "<tr><td><span>Food Preference : </span><select id='meal'><option  name='meal' value='default'>Select</option><option name = 'meal'value = 'veg'> Veg </option><option name='meal' value='nonveg'>NonVeg</option></select></td ></tr>" +
        "<tr><td><span>ID Card : </span><select id='idtype'><option  name='idtype' value='default'> Select </option><option name='idtype' value='pan'>PAN Card</option><option name = 'idtype'value = 'voterid'> VoterId Card </option></select ></td></tr>" + "<tr><td>ID Card number : <input  type='text' id='idCardNo'class='allCapital'/></td></tr>" + "</table>" + "<button id='savePassenger' type='button' >Save</button>" + "<button id='resetContactForm' type='reset'>Reset</button><button id='closeAddPassengerForm' type='button'>Close</button>";

    formNode.className = 'addPassengerForm';
    formNode.setAttribute("id", "contactPassengerForm");
    formNode.innerHTML = formcontent;
    mainNode.appendChild(formNode);
}

tb.saveContact = function () {
    var passengerName = d.getElementById("pFName").value.trim() + "_" + d.getElementById("pLName").value.trim(),
        passengerAge = d.getElementById("pAge").value,
        gender = d.getElementById("gender").value,
        berthPref = d.getElementById("berthPref").value,
        foodPref = d.getElementById("meal").value,
        idCardType = d.getElementById("idtype").value,
        idCardNo = d.getElementById("idCardNo").value,
        passengerDetails = {},
        keyId = passengerName + passengerAge;
    passengerDetails[keyId] = passengerName + ";" + passengerAge + ";" + gender + ";" + berthPref + ";" + foodPref + ";" + idCardType + ";" + idCardNo
    chrome.storage.sync.set(passengerDetails, function () {
        tb.retrieveContacts();
    });
}
/*
@desc: function augmentation to global object to recieve list of contacts from storage.sync and convert it into json object.
json object is appended to contacts key of global namespace
*/
tb.retrieveContacts = function () {
    this.contacts = {};
    var that = this;
    chrome.storage.sync.get(null, function (items) {
        var contacts = {},
            contactsArray = [];
        for (x in items) {
            if(x.match("JL~")==null){
             var values = items[x].split(";"),
                keyId = values[0] + values[1],
                contactDetail = {
                    "keyId": keyId,
                    "name": values[0].replace("_", " "),
                    "age": parseInt(values[1]),
                    "gender": values[2],
                    "berthPref": values[3],
                    "foodPref": values[4],
                    "idType": values[5],
                    "idNo": values[6]
                }           
            contactsArray.push(contactDetail);
                 }
        }
        contacts["contacts"] = contactsArray;
        that.contacts = contacts;
    });
};

tb.retrieveJourneyDetails = function () {
    var that = this;
    that.journeyDetails = {};   
    chrome.storage.sync.get(null, function(items) {
        var allJourneys={},
            allJourneysArray=[];            
        for (x in items) {
            if(x.match("JL~")!=null){               
                var singleJourneyObject={}; 
                 var   passengers = [];
                 var   children = [];
                    
                 var values = items[x].split("||");
                var passengersStringArray = values[0].split("$");
               var childrenStringArray = values[1].split("$");         
               singleJourneyObject["autoUpgrade"] = values[2];
                singleJourneyObject["mobileNumber"] = parseInt(values[3]);               
             singleJourneyObject["journeyLabel"] = x.slice(3)
                for(var i=0;i<passengersStringArray.length;i++){
                var singlePassenger = passengersStringArray[i];
                    singlePassenger = singlePassenger.split(";")
                    var singlePassengerObject = {                    
                    "name": singlePassenger[0],
                    "age": parseInt(singlePassenger[1]),
                    "gender": singlePassenger[2],
                    "berthPref": singlePassenger[3],
                    "foodPref": singlePassenger[4],
                    "idType": singlePassenger[5],
                    "idNo": singlePassenger[6]                    
                    }                    
                    passengers.push(singlePassenger);
                }             
                for(var i=0;i<childrenStringArray.length;i++){
                    
                var singleChild = childrenStringArray[i];
                    singleChild = singleChild.split(";")
                  
                    var singleChildObject = {                    
                    "name": singleChild[0],
                    "age": parseInt(singleChild[1]),
                    "gender": singleChild[2]                                        
                    }
                    
                    children.push(singleChild);
                    
                }
               
            singleJourneyObject["passengers"] = passengers;
                singleJourneyObject["children"] = children;
                allJourneysArray.push(singleJourneyObject);
               
                 }
        allJourneys["journeys"] = allJourneysArray;
        
        that.journeyDetails = allJourneys;
        console.log("finsied now")}
        
    });
};

tb.clearAllContacts = function () {
    chrome.storage.sync.clear(function () {
        tb.contacts = {};
    });
}
tb.omniboxSuggestions = [{
    content: "myfirst",
    description: "mydesc"
}];

tb.retrieveJourneyDetails();
tb.retrieveContacts();
console.dir(tb);
alert(tb);

//chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
//    suggest(suggestResArray);
//});
//chrome.omnibox.onInputEntered.addListener(function(text) {
//
//});

//chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
//     
//    switch(request.type) {
//        case "dom-loaded":
//           
//        break;  
//    }
//    return true;
//});
//
//chrome.runtime.onConnect.addListener(function(port) {
//    if(port.name == "my-channel"){
//        port.onMessage.addListener(function(msg) {
//            // do some stuff here
//        });
//    }
//});