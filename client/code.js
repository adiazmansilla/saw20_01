async function getEntities(req) {
    let myRequest = new Request(`/api/entities/${req}`);
    const response = await fetch(myRequest);
    return await response.json();
}

/**
 * Funcion que obtiene las anotaciones selecionadas
 * @param req
 */
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
    getCustomizedAnnotations(req);
}

/**
 * Obtiene el nombre del evento de la copa america
 * @param data
 * @param req
 */
function getEventName(data, req) {
    document.getElementById('country-code').innerHTML = req;
    //Obtiene el nombre del evento
    const eventName = data.entities[req]['labels']['es']['value'];
    document.getElementById('event-name').innerHTML = eventName;
    console.log('Nombre del evento: ' + eventName);
}

/**
 * Funcion que obtiene al equipo ganador
 * @param req
 */
function getWinnerTeamName(req) {
    getEntities(req).then(data => {
        var winnerTeam = data.entities[req]['labels']['es']['value'];
        console.log('Equipo Ganador: ' + winnerTeam);
        document.getElementById('winner-team').innerHTML = winnerTeam;
        window.stop();
    })
}

/**
 * Obtiene al país anfitrion de la copa
 * @param req
 */
function getHostCountry(req) {
    getEntities(req).then(data => {
        var hostCountry = data.entities[req]['labels']['es']['value'];
        console.log('Pais Anfitrion: ' + hostCountry);
        document.getElementById('host-country').innerHTML = hostCountry;
    })
}

/**
 * Obtiene goleador de la copa seleccionada
 * @param req
 */
function getGoleador(req) {
    for (g in req) {
        var goleadorId = req[g]['mainsnak']['datavalue']['value']['id'];
        getGoalName(goleadorId);
    }
}

/**
 * Obtiene los datos almacenados en bd a traves de la api en nodejs
 * @param req
 */
function getCustomizedAnnotations(req) {

    getEntitiesInDB(req).then(data => {
        for (d in data) {

            const annotationProperty = data[d]['annotationproperty'];
            const annotationValue = data[d]['annotationvalue'];

            addRow(annotationProperty, annotationValue);
        }

    })
}

async function getEntitiesInDB(req) {
    let myRequest = new Request(`/api/entities/${req}/annotations`);
    const response = await fetch(myRequest);
    return await response.json();
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

/**
 * Guarda variables en la sessionStorage
 * @param ent
 * @param country
 * @param year
 */
function pass(ent, country, year) {
    console.log(ent, country, year);
    sessionStorage.setItem("entityCode", ent);
    sessionStorage.setItem("entityCountry", country);
    sessionStorage.setItem("entityYear", year);
}

/**
 * Modifica la imagen segun la copa que se elija
 */
function loadImage() {
    var cdg = sessionStorage.getItem("entityCode");
    var cdgImg = '/images/' + cdg + '.jpg';
    $("img#Myimg").attr('src', cdgImg);
}

/**
 * Guarda la anotacion
 */
function saveAnnotation() {
    const entityCode = sessionStorage.getItem("entityCode");
    const annotationProperty = document.getElementById("_annotationProperty").value;
    const annotationValue = document.getElementById("_annotationValue").value;
    const data = {annotationProperty, annotationValue, entityCode};
    console.log(data);
    addRow(annotationProperty, annotationValue);
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch('/api/entities/annotations', options);
    return false;
}

/**
 * Elimina una anotacion
 */
function deleteAnnotation() {
    const entityCode = sessionStorage.getItem("entityCode");
    //const annotationProperty = document.getElementById("_annotationProperty").value;
    const annotationProperty = 'Hola';
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`/api/entities/${entityCode}/annotations/${annotationProperty}`, options);
    return false;
}

function addRow(annotationProperty, annotationValue) {
    const nameLabels = document.getElementById("custom-propertyname");
    const trLabel = document.createElement("tr");
    const textLabel = document.createTextNode(annotationProperty);
    trLabel.appendChild(textLabel);
    nameLabels.appendChild(trLabel);


    const valueLabels = document.getElementById("custom-propertyvalue");
    const trLabelV = document.createElement("tr");
    const textLabelV = document.createTextNode(annotationValue);
    trLabelV.appendChild(textLabelV);
    valueLabels.appendChild(trLabelV);


    // get the element you want to add the button to
    var myDiv = document.getElementById("btn-edit");
    const trButton = document.createElement("tr");
    // create the button object and add the text to it
    var button = document.createElement("BUTTON");
    button.innerHTML = "Editar";

    // add the button to the div
    trButton.appendChild(button);
    myDiv.appendChild(trButton);

    // get the element you want to add the button to
    var myDivDel = document.getElementById("btn-del");
    const trButtonDel = document.createElement("tr");
    // create the button object and add the text to it
    var buttonDel = document.createElement("BUTTON");
    buttonDel.innerHTML = "Eliminar";

    // add the button to the div
    trButtonDel.appendChild(buttonDel);
    myDivDel.appendChild(trButtonDel);
}
