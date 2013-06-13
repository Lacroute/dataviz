function setBadges () {
    console.log(json);
    $('.nomProfil').html(json.general.nom);
    $('#avatar').attr('src', json.general.photo);
}