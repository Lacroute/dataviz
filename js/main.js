$(document).ready(function(){

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

    /*$('#svgContent').on('click', function(event){
        event.preventDefault();
        if($(this).is('.on')){
            $('#content').toggleClass('on');
            $('#svgContent').toggleClass('on');
        }
    });*/

    //resize des blocs en hauteur dans la div description
   /* resizeDescriptionBlocks();
    $(window).resize(function(){
        resizeDescriptionBlocks();
    });         

    function resizeDescriptionBlocks(){
        var height = $("#content").height();
        $(".description").height((height/2)-$("header").height());
    }*/

	
});




