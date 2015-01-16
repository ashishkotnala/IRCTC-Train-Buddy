

/*
Listener for DOM load event
*/


d.addEventListener('DOMContentLoaded', function () {
    if(window.location.pathname=="/src/options.html"){
    tb.retrieveContacts();

    /*-------------------------------------------------------------------------*/
    /*
Listener for preferences tile click event
*/
    d.getElementById("appPreferencesControl").addEventListener("click", function () {
        var formContainerNode = d.getElementById("appPreferencesContainer");
        if (!formContainerNode.hasChildNodes()) {
            tb.activateCurrentView("appPreferencesContainer", "appPreferencesControl");
            formContainerNode.innerHTML = "<div style='text-align: center;margin: 40px;font-size:40px;'>Coming Soon...</div>";
        } else {
            alert("you aren't really done with this page");
        }
    });


    /*-------------------------------------------------------------------------*/
    /*
Listener for contacts tile click event
*/
    d.getElementById("passengerContactsControl").addEventListener("click", function () {
        var contactsMainNode = d.getElementById("passengerContactsContainer");
        if (!contactsMainNode.hasChildNodes()) {
            tb.activateCurrentView("passengerContactsContainer", "passengerContactsControl");
            var contactList = tb.contacts,
                contactsTable = d.createElement("table"),
                counter = 1;
            contactsTable.setAttribute("id", "contactsTable");
            contactsMainNode.appendChild(contactsTable);

            for (x in contactList.contacts) {
                var values = contactList.contacts[x];
                var trnode = d.createElement("tr")
                if (counter == 1) {
                    contactsTable.innerHTML += "<tr><th>Name</th><th>Age</th><th>Gender</th> <th>Berth Preference</th><th>Food Preference</th><th>ID Type</th><th>ID Number</th></tr>"
                }
                contactsTable.getElementsByTagName("tbody")[0].appendChild(trnode);
                for (x in values) {
                    if (x != "keyId") {
                        var tdnode = d.createElement("td");
                        var tdtextnode = d.createTextNode(values[x]);
                        tdnode.appendChild(tdtextnode);
                        contactsTable.getElementsByTagName("tr")[counter].appendChild(tdnode);
                    }
                }
                counter++;
            }

            var editButton = d.createElement("button"),
                editButtonText = d.createTextNode("Editt");
            editButton.setAttribute("id", "btnEditSelected")
            editButton.appendChild(editButtonText);
            contactsMainNode.appendChild(editButton);

            var addButton = d.createElement("button"),
                addButtonText = d.createTextNode("Add");
            addButton.setAttribute("id", "btnAddContact")
            addButton.appendChild(addButtonText);
            contactsMainNode.appendChild(addButton);

            var contactTableRows = contactsTable.querySelectorAll("tr");
            for (var i = 1; i < contactTableRows.length; i++) {
                contactTableRows[i].addEventListener("click", function () {
                    if (d.getElementsByClassName("selectedRow").length != 0) {
                        d.getElementsByClassName("selectedRow")[0].className = d.getElementsByClassName("selectedRow")[0].className.replace("selectedRow", "");
                    }
                    this.className += "selectedRow";
                })
            }
            d.getElementById("btnAddContact").addEventListener("click", function () {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('click', true, false);
                d.getElementById("addPassengerControl").dispatchEvent(event);
            });
            d.getElementById("btnEditSelected").addEventListener("click", function () {

                if (d.getElementsByClassName("selectedRow").length != 0) {
                    var selectedRow = d.getElementsByClassName("selectedRow")[0];
                    if (!(!d.getElementById("contactPassengerForm"))) {
                        contactsMainNode.removeChild(d.getElementById("contactPassengerForm"))
                    }
                    tb.contactForm(contactsMainNode);
                    var name = selectedRow.childNodes[0].textContent.split(" ");
                    d.getElementById("pFName").value = name[0];
                    d.getElementById("pLName").value = name[1];

                    d.getElementById("pAge").value = selectedRow.childNodes[1].textContent;
                    d.getElementById("gender").value = selectedRow.childNodes[2].textContent;
                    d.getElementById("berthPref").value = selectedRow.childNodes[3].textContent;
                    d.getElementById("meal").value = selectedRow.childNodes[4].textContent;
                    d.getElementById("idtype").value = selectedRow.childNodes[5].textContent;
                    d.getElementById("idCardNo").value = selectedRow.childNodes[6].textContent;

                } else {
                    alert("select a row to edit");
                }

                d.getElementById("savePassenger").addEventListener("click", function () {
                    var selectedKeyId = name[0] + "_" + name[1] + selectedRow.childNodes[1].textContent;
                    chrome.storage.sync.remove(selectedKeyId, function () {
                        tb.saveContact();
                        tb.retrieveContacts();
                    })
                });

            });



        } else {
            alert("You are already in this page");
        }
    });


    /*------------------------------------------------------------------------*/
    /*
Listener for add passenger tile click event
*/
    d.getElementById("addPassengerControl").addEventListener("click", function () {
        var addContactsMainNode = d.getElementById("addPassengerContainer");
        if (!addContactsMainNode.hasChildNodes()) {
            tb.activateCurrentView("addPassengerContainer", "addPassengerControl");
            tb.contactForm(addContactsMainNode);

            d.getElementById("savePassenger").addEventListener("click", function () {
                tb.saveContact();

            });
            d.getElementById("closeAddPassengerForm").addEventListener("click", function () {
                while (addContactsMainNode.firstChild) {
                    addContactsMainNode.removeChild(addContactsMainNode.firstChild);
                }
            });
        } else {
            alert("you aren't really done with this page");
        }
    });


    /*------------------------------------------------------------------------*/
    /*
Listener for prepare tatkal tile click event
*/
    d.getElementById("prepareTatkalControl").addEventListener("click", function () {
        var noOfChecked = 0;
        var tatkalMainNode = d.getElementById("prepareTatkalContainer");
        if (!tatkalMainNode.hasChildNodes()) {
            tb.activateCurrentView("prepareTatkalContainer", "prepareTatkalControl");
            tatkalMainNode.innerHTML += "<div id='prepareTatkalControls'><button id='chooseFromContacts'>Choose from contacts</button><button id='startNew'>Start new</button></div><div id='previewTatkal'><h3>Preview</h3></div>"
            var previewFormNode = d.createElement("form");
            previewFormNode.className = 'addPassengerForm';
            previewFormNode.setAttribute("id", "previewForm")
            var previewFormcontent = "<form>" +
                "<table><thead>" +
                "<tr><th>S.No</th>" +
                "<th>Name<span class='mandatory'>*</span> </th>" + "<th>Age<span class='mandatory'>*</span> </th> " + "<th>Gender<span class='mandatory'>*</span> </th> " + "<th>Berth Preference</th>" +
                "<th>Meal<span class='mandatory'>*</span> </th>" +
                "<th>ID Card Type<span class='mandatory'>*</span> </th>" +
                "<th>ID Card No<span class='mandatory'>*</span> </th> </tr></thead>" + " <tbody> ";
            for (var counter = 1; counter <= 4; counter++) {
                previewFormcontent += "<tr> " + "<td> <span>" + counter + "</span> </td><td> <input type='input' class='passengerNamePreview'id=\"psg" + counter + "Name\"/> </td><td> <input type='input'  id=\"psg" + counter + "Age\"/> </td><td> <select id=\"psg" + counter + "Gender\"> <option value='default'>Select</option> <option name='gender' value='male'>Male</option> <option name='gender' value='female'>Female</option> </select> </td><td> <select id=\"psg" + counter + "Berth\"> <option value='default'>Select</option> <option name='berthPref' value='lower'>Lower</option> <option name='berthPref' value='upper'>Upper</option> </select> </td><td> <select id=\"psg" + counter + "Meal\"> <option value='default'>Select</option> <option name='meal' value='veg'>Veg</option> <option name='meal' value='nonveg'>NonVeg</option> </select> </td><td> <select id=\"psg" + counter + "IDType\"> <option value='default'>Select</option> <option name='idtype' value='pan'>PAN Card</option> <option name='idtype' value='voterid'>VoterId Card</option> </select> </td><td> <input type='input' id=\"psg" + counter + "IDNo\"/> </td></tr>"
            }
            previewFormcontent += "<tr><td colspan='7'><button id='reset'>reset</button></td></tbody> </table>";

previewFormcontent += "<table> <thead> <tr> <th>S.No</th> <th>Name<span class='mandatory'>*</span> </th> <th>Age<span class='mandatory'>*</span> </th> <th>Gender<span class='mandatory'>*</span> </th> </tr></thead> <tbody> <tr> <td> <span>1</span> </td><td> <input type='input' id='child1Name'/> </td><td> <input type='input' id='child1Age'/> </td><td> <select id='child1Gender'> <option>Select</option> <option name='gender' value='male'>Male</option> <option name='gender' value='female'>Female</option> </select> </td><td></td></tr><tr> <td> <span>2</span> </td><td> <input type='input' id='child2Name'/> </td><td> <input type='input' id='child2Age'/> </td><td> <select id='child2Gender'> <option>Select</option> <option name='gender' value='male'>Male</option> <option name='gender' value='female'>Female</option> </select> </td><td></td></tr></tbody> </table> </form>";

            previewFormcontent += "<input type='checkbox' id='cbAutoUpgrade'/><span>Consider for Auto Upgradation</span><br/>" +
                "<span>Mobile Number : </span><input type='text' id='mobileNumber'/>";
            previewFormNode.innerHTML = previewFormcontent;
            tatkalMainNode.appendChild(previewFormNode);
            var saveLabelJourney = document.createElement("button");
            saveLabelJourney.setAttribute("id", "btnLabelJourney");
            var saveTextNode = d.createTextNode("save this journey");
            var labelField = d.createElement("input");
            labelField.setAttribute("type", "text");
            labelField.setAttribute("id", "labelField");
            saveLabelJourney.appendChild(saveTextNode);
            tatkalMainNode.appendChild(labelField);
            tatkalMainNode.appendChild(saveLabelJourney);

            d.getElementById("startNew").addEventListener("click", function () {
                var contactsMainNode = d.getElementById("prepareTatkalControls");
                if (!(!d.getElementById("chooseFromContactsTable"))) {
                    var removedNode = document.getElementById("chooseFromContactsTable");
                    removedNode.parentElement.removeChild(removedNode)
                }
                if (!d.getElementById("newPassengerQuickForm")) {
                    var formNode = d.createElement("form");
                    formNode.setAttribute("id", "newPassengerQuickForm");

                    formNode.className = 'addPassengerForm';
                    var formcontent = "<table>" +
                        "<tr><td><span>Name : </span><input type = 'input' id = 'pFName' required/><input type = 'input' id = 'pLName' required/></td></tr>" +
                        "<tr><td><span>Age : </span><input type='input' id='pAge'/></td></tr>" +
                        "<tr><td><span>Gender : </span><select id='gender'><option name='gender' value='default'>Select</option><option name = 'gender'value = 'male'> Male </option><option name='gender' value='female'>Female</option ></select></td ></tr>" +
                        "<tr><td><span>Berth Preference : </span><select id='berthPref'><option name='berthPref' value='default'> Select </option><option name='berthPref' value='lower'>Lower</option ><option name = 'berthPref'value = 'upper'> Upper </option></select></td></tr>" + "<tr><td><span>Food Preference : </span><select id='meal'><option  name='meal' value='default'>Select</option><option name = 'meal'value = 'veg'> Veg </option><option name='meal' value='nonveg'>NonVeg</option></select></td ></tr>" +
                        "<tr><td><span>ID Card : </span><select id='idtype'><option  name='idtype' value='default'> Select </option><option name='idtype' value='pan'>PAN Card</option><option name = 'idtype'value = 'voterid'> VoterId Card </option></select ></td></tr>" + "<tr><td>ID Card number : <input type='input' id='idCardNo'/></td></tr>" + "</table>" + "<button id='addToPreview' type='button' >Save</button>";
                    formNode.innerHTML = formcontent;
                    contactsMainNode.appendChild(formNode);
                }

                d.getElementById("addToPreview").addEventListener("click", function () {

                    var passengerName = d.getElementById("pFName").value.trim() + " " + d.getElementById("pLName").value.trim(),
                        passengerAge = d.getElementById("pAge").value,
                        gender = d.getElementById("gender").value,
                        berthPref = d.getElementById("berthPref").value,
                        foodPref = d.getElementById("meal").value,
                        idCardType = d.getElementById("idtype").value,
                        idCardNo = d.getElementById("idCardNo").value;
                    var keyId = d.getElementById("pFName").value.trim() + "_" + d.getElementById("pLName").value.trim() + d.getElementById("pAge").value;
                    if (tb.contacts.contacts.length == 0) {
                        var response = confirm(passengerName + " does not exist in your contacts\n Add " + passengerName + " to your contacts ?");
                        passengerName = passengerName.replace(" ", "_");
                        if (response) {
                            var passengerDetails = {};

                            passengerDetails[keyId] = passengerName + ";" + passengerAge + ";" + gender + ";" + berthPref + ";" + foodPref + ";" + idCardType + ";" + idCardNo
                            chrome.storage.sync.set(passengerDetails, function () {
                                tb.retrieveContacts();
                            });
                        }
                    }
                    for (var i = 0; i < tb.contacts.contacts.length; i++) {
                        if (keyId != tb.contacts.contacts[i]["keyId"]) {
                            var response = confirm(passengerName + " does not exist in your contacts\n\nAdd " + passengerName + " to your contacts ?");
                            if (response) {
                                var passengerDetails = {};

                                passengerDetails[keyId] = passengerName + ";" + passengerAge + ";" + gender + ";" + berthPref + ";" + foodPref + ";" + idCardType + ";" + idCardNo
                                chrome.storage.sync.set(passengerDetails, function () {
                                    tb.retrieveContacts();
                                });
                            }
                        }
                    }
                    noOfChecked++;
                    d.getElementById("psg" + noOfChecked + "Name").value = passengerName;
                    d.getElementById("psg" + noOfChecked + "Age").value = passengerAge;
                    d.getElementById("psg" + noOfChecked + "Gender").value = gender;
                    d.getElementById("psg" + noOfChecked + "Berth").value = berthPref;
                    d.getElementById("psg" + noOfChecked + "Meal").value = foodPref;
                    d.getElementById("psg" + noOfChecked + "IDType").value = idCardType;
                    d.getElementById("psg" + noOfChecked + "IDNo").value = idCardNo;

                });
            });

            d.getElementById("chooseFromContacts").addEventListener("click", function () {
                var contactsMainNode = d.getElementById("prepareTatkalControls");
                if (!(!d.getElementById("newPassengerQuickForm"))) {
                    var removedNode = document.getElementById("newPassengerQuickForm");
                    removedNode.parentElement.removeChild(removedNode)
                }

                if (!d.getElementById("chooseFromContactsTable")) {
                    var contactList = tb.contacts,
                        counter = 1,
                        contactsTable = d.createElement("table");
                    contactsTable.setAttribute("id", "chooseFromContactsTable");
                    contactsMainNode.appendChild(contactsTable);

                    for (x in contactList.contacts) {
                        var contact = contactList.contacts[x];

                        var trnode = d.createElement("tr")
                        if (counter == 1) {
                            contactsTable.innerHTML += "<tr><th colspan='2'>Name</th></tr>"
                        }
                        contactsTable.getElementsByTagName("tbody")[0].appendChild(trnode);
                        for (x in contact) {
                            if (x == "name" || x == "age") {
                                var tdnode = d.createElement("td");

                                var tdtextnode = d.createTextNode(contact[x]);
                                tdnode.appendChild(tdtextnode);
                                contactsTable.getElementsByTagName("tr")[counter].appendChild(tdnode);
                            }



                        }
                        counter++;
                        var tdchecknode = d.createElement("td");
                        var checkboxnode = d.createElement("input");
                        checkboxnode.setAttribute("type", "checkbox");
                        checkboxnode.className = 'contactCheckBox';
                        var checkboxId = contact["name"].replace(" ", "_");
                        checkboxId += contact["age"]
                        checkboxnode.setAttribute("id", checkboxId);
                        for (x in contact) {
                            checkboxnode.setAttribute("data-" + x, contact[x]);

                        }
                        tdchecknode.appendChild(checkboxnode)
                        trnode.appendChild(tdchecknode)
                    }
                }
                var checkboxnodes = d.getElementsByClassName("contactCheckBox"),
                    counter = 0;
                var formnode = document.getElementById("previewForm");
                var nameinputs = formnode.querySelectorAll(".passengerNamePreview");
                while (counter < checkboxnodes.length) {
                    checkboxnodes[counter].addEventListener("change", function () {
                        if (this.checked) {

                            noOfChecked++;
                            var parentRow = d.getElementById("psg" + noOfChecked + "Name").parentElement.parentElement;
                            parentRow.setAttribute("data-checkboxId", this.id);
                            d.getElementById("psg" + noOfChecked + "Name").value = this.getAttribute("data-name");
                            d.getElementById("psg" + noOfChecked + "Age").value = this.getAttribute("data-age");
                            d.getElementById("psg" + noOfChecked + "Gender").value = this.getAttribute("data-gender");
                            d.getElementById("psg" + noOfChecked + "Berth").value = this.getAttribute("data-berthpref");
                            d.getElementById("psg" + noOfChecked + "Meal").value = this.getAttribute("data-foodpref");
                            d.getElementById("psg" + noOfChecked + "IDType").value = this.getAttribute("data-idtype");
                            d.getElementById("psg" + noOfChecked + "IDNo").value = this.getAttribute("data-idno");

                        } else {
                            var checkboxId = this.id;
                            var c = document.querySelector("[data-checkboxid=\"" + checkboxId + "\"]");
                            var allInputs = c.querySelectorAll("input"),
                                allSelects = c.querySelectorAll("select");
                            for (var i = 0; i < allInputs.length; i++) {
                                allInputs[i].value = '';

                            }
                            for (var i = 0; i < allSelects.length; i++) {
                                allSelects[i].value = 'default';
                            }
                        }
                    });
                    counter++;
                }
            });
            d.getElementById("btnLabelJourney").addEventListener("click", function () {
                 journeyDetails = [];
                 singlePassenger='';
                singleChild='';
              for(var i=1;i<5;i++){
                  var name = d.getElementById("psg" + i + "Name").value;
                  if(name!=''){
                                singlePassenger+=name;
                   singlePassenger+=";"+d.getElementById("psg" + i + "Age").value;
              singlePassenger+=";"+d.getElementById("psg" + i + "Gender").value;
             singlePassenger+= ";"+d.getElementById("psg" + i + "Berth").value;
              singlePassenger+=";"+d.getElementById("psg" + i + "Meal").value;
               singlePassenger+=";"+d.getElementById("psg" + i + "IDType").value;
             singlePassenger+= ";"+d.getElementById("psg" + i + "IDNo").value ;
                      
             singlePassenger+="$";
                  }
              }
               singlePassenger=singlePassenger.slice(0,singlePassenger.lastIndexOf("$"));
                journeyDetails.push(singlePassenger);
                 for(var i=1;i<3;i++){
               var name = d.getElementById("child" + i + "Name").value;
                  if(name!=''){
                  singleChild+=name;
                   singleChild+=";"+d.getElementById("child" + i + "Age").value;
              singleChild+=";"+d.getElementById("child" + i + "Gender").value;
           
             singleChild+="$";
                  }
              }
                 singleChild=singleChild.slice(0,singleChild.lastIndexOf("$"));
journeyDetails.push(singleChild);
                journeyDetails.push(d.getElementById('cbAutoUpgrade').checked);
                journeyDetails.push(d.getElementById('mobileNumber').value);
                
                var keyForJourney = 'JL~'+d.getElementById('labelField').value;
                var journeyObject = {};
                journeyObject[keyForJourney] = journeyDetails.join("||")
                 chrome.storage.sync.set(journeyObject, function () {
        tb.retrieveContacts();
    });
                
            });

        } else {
            alert("you aren't really done with this page");
        }
    });
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    d.getElementById("appPreferencesControl").dispatchEvent(event);
}});