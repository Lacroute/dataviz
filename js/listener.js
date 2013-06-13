function setBadges () {
    console.log(json);
    var comportementLabel = '', comportementDescription = '', cl = $('#comportementLabel'), cd = $('#comportementDescription');

    /*** JSON.GENERAL ***/
    $('#nomProfil').html(json.general.nom_complet);
    $('#nomDescription').html(json.general.prenom);
    $('#avatar').attr('src', json.general.photo);
    /*** [END] JSON.GENERAL ***/

    /*** BADGES ***/
    $('#grade img').attr('src', 'media/badge_'+noAccent(json.badges[0].label)+'.png');
    $('#grade').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[0].label, json.badges[0].description, $(this).offset().top);
    });

    $('#check p').html(json.badges[1].nb);
    $('#check').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[1].label, json.badges[1].description, $(this).offset().top);
    });

    $('#follow img').attr('src', 'media/badge_'+noAccent(json.badges[3].label)+'.png');
    $('#follow').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[3].label, json.badges[3].description, $(this).offset().top);
    });

    /*** [END] BADGES ***/

    /*** DESCRIPTION ***/
    
    function initComportement(){
        if(json.badges[4].length != undefined){
            comportementLabel = json.badges[4].label + ' ';
            comportementDescription = '<p>'+json.badges[4].description+'</p>';
        }
        comportementLabel += json.badges[5].label;
        comportementDescription += '<p>'+json.badges[5].description+'</p>';
    }
    initComportement();
    
    function updateComportement(label, description, toOffset){
        cl.html(label);
        cd.html(description);
        console.log(toOffset);
        $('#content').animate({scrollTop: $(this).height()});
    }
    /*** [END] DESCRIPTION ***/

    function noAccent (my_string) {
        var new_string = "";
        var pattern_accent = new Array("é", "è", "ê", "ë", "ç", "à", "â", "ä", "î", "ï", "ù", "ô", "ó", "ö", " ");
        var pattern_replace_accent = new Array("e", "e", "e", "e", "c", "a", "a", "a", "i", "i", "u", "o", "o", "o", "");
        if (my_string && my_string!= "") {
            new_string = pregReplace (pattern_accent, pattern_replace_accent, my_string);
        }
        return new_string;
    }

    function pregReplace (array_pattern, array_pattern_replace, my_string)  {
        var new_string = String (my_string);
        for (i=0; i<array_pattern.length; i++) {
            var reg_exp= RegExp(array_pattern[i], "gi");
            var val_to_replace = array_pattern_replace[i];
            new_string = new_string.replace (reg_exp, val_to_replace);
        }
        return new_string;
    }

    function closeMenu(){
        if($('#content').is('.on')){
            $('#content').removeClass('on');
        }
    }
}