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
}

/**
 * Funcion que obtiene al equipo ganador
 * @param req
 */
function getWinnerTeamName(req) {
    getEntities(req).then(data => {
        var winnerTeam = data.entities[req]['labels']['es']['value'];
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
 * Guarda una nueva anotacion
 */
function saveAnnotation() {
    const entityCode = sessionStorage.getItem("entityCode");
    const annotationProperty = document.getElementById("_annotationProperty").value;
    const annotationValue = document.getElementById("_annotationValue").value;
    const data = {annotationProperty, annotationValue, entityCode};
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch('/api/entities/annotations', options)
        .then((response) => {
            if (response.ok) {
                $('#AddEntityModal').modal('hide');
                addRow(annotationProperty, annotationValue);
            } else {
                $('#AddEntityModal').modal('hide');
                window.alert('Ocurrió un error al agregar la anotación');
            }
        });
    return false;
}

/**
 * Guarda los cambios en una anotacion
 * @returns {boolean}
 * @constructor
 */
function edAnnotation() {
    const entityCode = sessionStorage.getItem("entityCode");
    const annotationProperty = document.getElementById("idPropertyHolder").textContent;
    const annotationValue = document.getElementById("idValueHolder").value;
    const data = {annotationProperty, annotationValue, entityCode};
    console.log(data);
    const options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch('/api/entities/annotations', options).then((response) => {
        if (response.ok) {
            $('#modalEdit').modal('hide');
        } else {
            $('#modalEdit').modal('hide');
            window.alert('Ocurrió un error al agregar la anotación');
        }
    });
    return false;
}

/**
 * Elimina una anotacion
 */
function deleteAnnotation(annotationProperty) {
    const entityCode = sessionStorage.getItem("entityCode");
    console.log('deleting... ' + annotationProperty);
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`/api/entities/${entityCode}/annotations/${annotationProperty}`, options)
        .then((response) => {
            if (response.ok) {
                window.alert('Anotación eliminada con éxito');
            } else {
                throw new Error('Ocurrió un error al eliminar la anotación');
            }
        });
    return false;
}

function addRow(annotationProperty, annotationValue) {


    var tabla = document.getElementById('tblCustom');
    const trCreate = document.createElement("tr");
    const trLabel = document.createElement("td");
    const textLabel = document.createTextNode(annotationProperty);
    trLabel.appendChild(textLabel);
    trCreate.appendChild(trLabel);

    const trLabelV = document.createElement("td");
    const textLabelV = document.createTextNode(annotationValue);
    trLabelV.appendChild(textLabelV);
    trCreate.appendChild(trLabelV);


    // get the element you want to add the button to
    const tdButtonEdit = document.createElement("td");
    tdButtonEdit.className="btnp"
    // create the button object and add the text to it
    var btnEdit = document.createElement("button");
    btnEdit.className = "btn btn-success glyphicon glyphicon-pencil";
   // btnEdit.innerHTML = "Editar";
    btnEdit.onclick = function () {
        $('#modalEdit').modal('show');
        document.getElementById('idPropertyHolder').innerHTML = annotationProperty;
        idValueHolder.value = annotationValue;
    };

    // add the button to the div
    tdButtonEdit.appendChild(btnEdit);
    trCreate.appendChild(tdButtonEdit);

    // get the element you want to add the button to
    const tdButtonDel = document.createElement("td");
    tdButtonDel.className="btnp";
    // create the button object and add the text to it
    var buttonDel = document.createElement("button");
    buttonDel.className = "btn btn-danger fa fa-trash";
//    buttonDel.innerHTML = " Eliminar";
    buttonDel.onclick = function () {
        deleteAnnotation(annotationProperty);
    }

    // add the button to the div
    tdButtonDel.appendChild(buttonDel);
    trCreate.appendChild(tdButtonDel);

    tabla.appendChild(trCreate);
}
