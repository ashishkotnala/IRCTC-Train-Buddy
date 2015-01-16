document.addEventListener('DOMContentLoaded', function () {
    
console.log("sfd");
    
 journeys = tb.journeyDetails;
    console.log("journey det called");
    console.dir(journeys);
    var mainNode = d.getElementById("contentContainer");
    for(var i=0;i<journeys.length;i++){
var journeyLabel = journeys[i].journeyLabel; 
        var labelDiv = d.createElement("div");
        labelDiv.setAttribute("id",journeyLabel);
        labelDiv.appendChild(d.createTextNode(labelDiv));
        mainNode.appendChild(labelDiv);}
   

 
   
});