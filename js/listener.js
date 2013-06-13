function setBadges () {
    console.log(json);
    var comportementLabel = '', comportementDescription = '', cl = $('#comportementLabel'), cd = $('#comportementDescription');

    /*** JSON.GENERAL ***/
    $('#nomProfil').html(json.general.nom_complet);
    $('#nomDescription').html(json.general.prenom);
    $('#avatar').attr('src', json.general.photo);
    /*** [END] JSON.GENERAL ***/

    /*** BADGES ***/
    $('#grade img').attr('src', 'media/badge_'+json.badges[0].label+'.png');
    $('#grade').on('click', function(event){
        event.preventDefault();
        updateComportement(json.badges[0].label, json.badges[0].description, $(this).offset().top);
    });

    /*** [END] BADGES ***/

    /*** DESCRIPTION ***/
    
    if(json.badges[4].length != undefined){
        comportementLabel = json.badges[4].label + ' ';
        comportementDescription = '<p>'+json.badges[4].description+'</p>';
    }
    comportementLabel += json.badges[5].label;
    comportementDescription += '<p>'+json.badges[5].description+'</p>';

    function updateComportement(label, description, toOffset){
        cl.html(label);
        cd.html(description);
        if(toOffset>0) $('#content').animate({scrollTop: toOffset});
    }
    /*** [END] DESCRIPTION ***/
}