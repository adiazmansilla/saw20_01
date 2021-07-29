function getFormattedInfo(){
    floatingTextarea.innerHTML = '';
    const selectedRadio = $('input[name="flexRadioDefault"]:checked').val();
    const selectedType = $('#selectType').find(":selected").val();
    console.log("RADIO_BUTTON: "+selectedRadio);
    console.log("SELECT_Type: "+selectedType);
    const options = {
        method: 'GET',
        headers: {
            'Accept': `${selectedType}`
        }
    }
    console.log(options);
    fetch(`/api/entities-all-types/${selectedRadio}`, options)
        .then((response) => {
            if (response.ok) {

                response.text().then(text=>{

                    floatingTextarea.innerHTML = text;
                });
                console.log('Todo ok');
            } else {
                window.alert('Ocurrió un error al buscar ');
            }
        });
    return false;

}