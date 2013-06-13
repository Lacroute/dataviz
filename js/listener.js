function setBadges () {
    console.log(json);
    $('#nomProfil').html(json.general.nom);
    console.log($('#avatar').attr('src', json.general.photo));
}