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
        const ulLabels = document.getElementById("claims");
        
        for(var attributename in data.entities[req]){
            const liEntity = document.createElement("li");
            const text = document.createTextNode(attributename+": "+data.entities[req][attributename]);
            liEntity.appendChild(text);
            //ulEntities.appendChild(liEntity);
            document.getElementById('country-code').innerHTML=req;

            if(attributename == 'labels'){
                const labelsArray =  data.entities[req][attributename]
                for(let label in labelsArray){
                    if(label =='es'){
                        const countryName = labelsArray[label]['value'];
                        document.getElementById('country-name').innerHTML=countryName;
                        console.log(countryName);
                    }
                }


            }

            if (attributename == 'claims'){

                const claimsArray =  data.entities[req][attributename];
                for(var claim in claimsArray){

                    console.log(JSON.stringify(claim));

                    const liLabel = document.createElement("li");
                    const textLabel = document.createTextNode(claim);
                    liLabel.appendChild(textLabel);
                    ulLabels.appendChild(liLabel);
                }
            }
        }
    })
}