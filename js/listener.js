function setBadges () {
    console.log(json.badges[5]);
    $('.nomProfil').html(json.general.nom);
    $('#avatar').attr('src', json.general.photo);
    var comportementLabel = '', comportementDescription = '';
    console.log(json.badges[4]);
    if(json.badges[4].length != undefined){
        console.log('caca');
        comportementLabel = json.badges[4].label + ' ';
        comportementDescription = '<p>'+json.badges[4].description+'</p>';
        console.log('********* '+comportementLabel);
    }
    comportementLabel += json.badges[5].label;
    comportementDescription += '<p>'+json.badges[5].description+'</p>';
    $('#comportementLabel').html(comportementLabel);
    $('#comportementDescription').html(comportementDescription);

}