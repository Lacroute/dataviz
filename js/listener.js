function setBadges () {
    console.log(json);
    /*** JSON.GENERAL ***/
    $('#nomProfil').html(json.general.nom_complet);
    $('#nomDescription').html(json.general.prenom);
    $('#avatar').attr('src', json.general.photo);
    /*** [END] JSON.GENERAL ***/

    /*** BADGES ***/
    $('#grade img').attr('src', 'media/badge_'+json.badges[0].label+'.png')

    /*** [END] BADGES ***/

    /*** DESCRIPTION ***/
    var comportementLabel = '', comportementDescription = '';
    if(json.badges[4].length != undefined){
        comportementLabel = json.badges[4].label + ' ';
        comportementDescription = '<p>'+json.badges[4].description+'</p>';
    }
    comportementLabel += json.badges[5].label;
    comportementDescription += '<p>'+json.badges[5].description+'</p>';
    $('#comportementLabel').html(comportementLabel);
    $('#comportementDescription').html(comportementDescription);
    /*** [END] DESCRIPTION ***/
}