/*** GESTION CLICKS ***/
var comportementLabel = '',
    comportementDescription = '',
    cl = $('#comportementLabel'),
    cd = $('#comportementDescription');

$('#content header').on('click', function(event){
        event.preventDefault();
        $('#content').toggleClass('on');
        $('#svgContent').toggleClass('on');
});

$('#openNote').on('click', function(event){
    event.preventDefault();
    $('#note').toggleClass('on');

});

$('#openLegende').on('click', function(event){
    event.preventDefault();
    $('#legende').toggleClass('on');

});

$('#closeLegende').on('click', function(event){
    event.preventDefault();
    $('#legende').toggleClass('on');
    $('#content').toggleClass('on');
});

$('#closeNote').on('click', function(event){
    event.preventDefault();
    $('#note').toggleClass('on');
    $('#content').toggleClass('on');
});

$('#menu a').on('click', function(event){
    event.preventDefault();
    $('#content').toggleClass('on');
    $('#content').animate({scrollTop:0}, 1000);
});

$('#deployChecks').on('click', function(event){
    initComportement();
});

$('#deployDailyTips').on('click', function(event){
    comportementLabel = json.badges[6].label;
    comportementDescription = json.badges[6].description;
    updateComportement(comportementLabel, comportementDescription);
});

/*** [END] GESTION CLICKS ***/

function initComportement(){
    comportementLabel = json.badges[4].label + ' ';
    comportementDescription = '<p>'+json.badges[4].description+'</p>';
    comportementLabel += json.badges[5].label;
    comportementDescription += '<p>'+json.badges[5].description+'</p>';
    
    updateComportement(comportementLabel, comportementDescription);
}

function updateComportement(label, description){
    cl.html('');
    cd.html('');

    cl.html(label);
    cd.html(description);
}

function setBadges () {
    // console.log(json.badges[4]);
    console.log(json);

    /*** JSON.GENERAL ***/
    $('#nomProfil').html(json.general.nom_complet);
    $('#nomDescription').html(json.general.prenom);
    $('#avatar').attr('src', json.general.photo);
    $('#badgeNote p').html(json.general.note);

    /*** [END] JSON.GENERAL ***/

    /*** BADGES ***/
    $('#grade img').attr('src', 'media/badge_'+noAccent(json.badges[0].label)+'.png');
    $('#grade').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[0].label, json.badges[0].description);
        $('#content').animate({scrollTop: $(this).height()}, 700);
    });

    $('#check p').html(json.badges[1].nb);
    $('#check').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[1].label, json.badges[1].description);
        $('#content').animate({scrollTop: $(this).height()}, 700);
    });

    $('#amis p').html(json.badges[2].nb);
    $('#amis img').attr('src', 'media/badge_'+noAccent(json.badges[2].label)+'.png');
    $('#amis').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[2].label, json.badges[2].description);
        $('#content').animate({scrollTop: $(this).height()}, 700);
    });

    $('#follow img').attr('src', 'media/badge_'+noAccent(json.badges[3].label)+'.png');
    $('#follow').on('click', function(event){
        event.preventDefault();
        closeMenu();
        updateComportement(json.badges[3].label, json.badges[3].description);
        $('#content').animate({scrollTop: $(this).height()}, 700);
    });

    /*** [END] BADGES ***/

    initComportement();
    initShareText();
    setCookie();
    alert(isFirstTime());

    function initShareText(){
        $("#share-container").attr("addthis:title","J'ai obtenu un score de "+json.general.note+" sur Omnisquare ! Découvre la tienne sur http://past.is/Py2z #omnisquare #foursquare");
    }

    function getCookie(c_name)
    {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
      {
      c_start = c_value.indexOf(c_name + "=");
      }
    if (c_start == -1)
      {
      c_value = null;
      }
    else
      {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1)
      {
    c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
    }

    function setCookie(){
        $("#legende").addClass(classLegende);
        var exdate=new Date(),
        c_name = "omnisquare_visited",
        value = "1",
        exdays = 30;
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
    }

    function isFirstTime(){
        var output;
        var visited=getCookie("omnisquare_visited");
        if (visited == "1"){
            output = "";
        }else{
            output = "on";
        }
        return output;
    }

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