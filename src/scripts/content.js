document.addEventListener('DOMContentLoaded', function () {
    
});
window.addEventListener("load", function() {
/*chrome.storage.sync.get(null, function(items){
        for(x in items){
            var values = items[x].split(";"),
                valuesLength = values.length;
            for(var i=0;i<values.length;i++){
           console.log("yipp"+values[i])}
        }});*/
    chrome.extension.sendMessage({
        type: "dom-loaded", 
        data: {
            myProperty: "this is sent from content"
        }
    });
}, true);

var port = chrome.runtime.connect({name: "my-channel"});
port.postMessage({myProperty: "value"});
port.onMessage.addListener(function(msg) {
    // do some stuff here
});

