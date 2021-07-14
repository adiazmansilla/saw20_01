async function getEntities(req) {
    var myRequest = new Request(`/api/entities/${req}`);
    const response = await fetch(myRequest);
    const data = await response.json();
   
    return data;
}

function fillEntities(req) {
   
    getEntities(req).then(data => {
        //console.log(data.entities);
        const ulEntities = document.getElementById("entities");
        const ulLabels = document.getElementById("labels");
        
        for(var attributename in data.entities[req]){
            const liEntity = document.createElement("li");
            const text = document.createTextNode(attributename+": "+data.entities[req][attributename]);
            liEntity.appendChild(text);
            ulEntities.appendChild(liEntity);

            if (attributename == 'labels'){
                const labelsArray =  data.entities[req][attributename];
                for(var label in labelsArray){
                    const liLabel = document.createElement("li");
                    const textLabel = document.createTextNode(label+": "+labelsArray[label]['value']);
                    liLabel.appendChild(textLabel);
                    ulLabels.appendChild(liLabel);        
                }
            }
        }
    })
}