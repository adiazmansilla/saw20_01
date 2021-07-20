async function getEntities(req) {
    let myRequest = new Request(`/api/entities/${req}`);
    const response = await fetch(myRequest);
    return await response.json();
}

function fillEntities(req) {
   
    getEntities(req).then(data => {
        const ulLabels = document.getElementById("claims");

        //Obtiene el id del equipo ganador
        var winnerId = data.entities[req]['claims']['P1346'][0]['mainsnak']['datavalue']['value']['id'];
        getWinnerTeamName(winnerId);

        console.log(winnerId);

        for(let attributename in data.entities[req]){
            document.getElementById('country-code').innerHTML=req;
            //document.getElementById('ca-winner').innerHTML=req;

            //Obtiene el nombre del evento
            if(attributename === 'labels'){
                const labelsArray =  data.entities[req][attributename]
                for(let label in labelsArray){
                    if(label === 'es'){
                        const countryName = labelsArray[label]['value'];
                        document.getElementById('country-name').innerHTML=countryName;
                        console.log(countryName);
                    }
                }
            }




            if (attributename === 'claims'){
                let claimsArray =  data.entities[req][attributename];
                for(let claim in claimsArray){
                    if(claim==='P1346'){
                        // let winnerArray =  data.entities[req][attributename][claim];
                        // let win = winnerArray[0];
                        // for(const key in win){
                        //     if(key==='mainsnak'){
                        //         let mainsnakObj =  data.entities[req][attributename][claim][0][key];
                        //         for(let dataval in mainsnakObj){
                        //             if(dataval==='datavalue'){
                        //                 let winnerValue =  data.entities[req][attributename][claim][0][key][dataval];
                        //                 for(const wv in winnerValue){
                        //                     if(wv === 'value'){
                        //                         let winnerValuevalue =  data.entities[req][attributename][claim][0][key][dataval][wv];
                        //                         for( let wvv in winnerValuevalue){
                        //                             if(wvv === 'id'){
                        //                                 let winnerValueid =  data.entities[req][attributename][claim][0][key][dataval][wv][wvv];
                        //                                 console.log(JSON.stringify(winnerValueid));
                        //                             }
                        //                         }
                        //
                        //                     }
                        //                 }
                        //
                        //             }
                        //
                        //         }
                        //
                        //     }
                        // }

                    }

                    const liLabel = document.createElement("tr");
                    const textLabel = document.createTextNode(claim);
                    liLabel.appendChild(textLabel);
                    ulLabels.appendChild(liLabel);
                }
            }
        }
    })
}

function getWinnerTeamName(req) {
    getEntities(req).then(data => {
        console.log('***** WINNER TEAM *****');
        console.log(JSON.stringify(data.entities[req]['labels']['es']['value']));
        console.log('***************');
        window.stop();
    })
}

function pass(ent, country, year){
    console.log(ent, country, year);
    sessionStorage.setItem("entityCode", ent);
    sessionStorage.setItem("entityCountry", country);
    sessionStorage.setItem("entityYear", year);
}

function loadImage(){
    var cdg = sessionStorage.getItem("entityCode");
    var cdgImg = '/images/'+cdg+'.jpg';
   $("img#Myimg").attr('src',cdgImg);
}