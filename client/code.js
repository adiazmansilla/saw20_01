async function getEntities(req) {
    let myRequest = new Request(`/api/entities/${req}`);
    const response = await fetch(myRequest);
    return await response.json();
}

function fillEntities(req) {

    getEntities(req).then(data => {

        //Obtiene el id del equipo ganador
        var winnerId = data.entities[req]['claims']['P1346'][0]['mainsnak']['datavalue']['value']['id'];
        getWinnerTeamName(winnerId);

        //Obtiene la edicion de la copa america
        var editionId = data.entities[req]['claims']['P393'][0]['mainsnak']['datavalue']['value'];
        console.log('Edición: ' + editionId);
        document.getElementById('champ-edition').innerHTML = editionId;

        //Obtiene el nombre del pais
        var countryId = data.entities[req]['claims']['P17'][0]['mainsnak']['datavalue']['value']['id'];
        getHostCountry(countryId);

        //Obtiene el agno
        var year = data.entities[req]['claims']['P585'][0]['mainsnak']['datavalue']['value']['time'];
        document.getElementById('champ-year').innerHTML = parseInt(year);

        //Obtiene goleadores
        var goleador = data.entities[req]['claims']['P3279'];
        getGoleador(goleador);

        //Obtiene nombre del evento
        getEventName(data, req);
    })
}

function getEventName(data, req) {
    document.getElementById('country-code').innerHTML = req;
    //Obtiene el nombre del evento
    const eventName = data.entities[req]['labels']['es']['value'];
    document.getElementById('event-name').innerHTML = eventName;
    console.log('Nombre del evento: ' + eventName);
}

function getWinnerTeamName(req) {
    getEntities(req).then(data => {
        var winnerTeam = data.entities[req]['labels']['es']['value'];
        console.log('Equipo Ganador: ' + winnerTeam);
        document.getElementById('winner-team').innerHTML = winnerTeam;
        window.stop();
    })
}

function getHostCountry(req) {
    getEntities(req).then(data => {
        var hostCountry = data.entities[req]['labels']['es']['value'];
        console.log('Pais Anfitrion: ' + hostCountry);
        document.getElementById('host-country').innerHTML = hostCountry;
    })
}

function getGoleador(req) {
    for (g in req) {
        var goleadorId = req[g]['mainsnak']['datavalue']['value']['id'];
        getGoalName(goleadorId);
    }
}

/**
 * Obtiene goleadores
 * @param req
 */
function getGoalName(req) {
    getEntities(req).then(data => {
        const ulLabels = document.getElementById("goleadores");
        var goleador = data.entities[req]['labels']['es']['value']
        console.log('Goleador: ' + goleador);
        const liLabel = document.createElement("tr");
        const textLabel = document.createTextNode(goleador);
        liLabel.appendChild(textLabel);
        ulLabels.appendChild(liLabel);
    })

}


function pass(ent, country, year) {
    console.log(ent, country, year);
    sessionStorage.setItem("entityCode", ent);
    sessionStorage.setItem("entityCountry", country);
    sessionStorage.setItem("entityYear", year);
}

function loadImage() {
    var cdg = sessionStorage.getItem("entityCode");
    var cdgImg = '/images/' + cdg + '.jpg';
    $("img#Myimg").attr('src', cdgImg);
}