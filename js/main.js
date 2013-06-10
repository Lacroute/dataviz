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

    $('#closeNote').on('click', function(event){
    	event.preventDefault();
    	$('#note').toggleClass('on');
    });

    $('#menu a').on('click', function(event){
    	event.preventDefault();
    	$('#content').toggleClass('on');
    });

    $('#svgContent').on('click', function(event){
        event.preventDefault();
        if($(this).is('.on')){
            $('#content').toggleClass('on');
            $('#svgContent').toggleClass('on');
        }
    });

    //resize des blocs en hauteur dans la div description
    resizeDescriptionBlocks();
    $(window).resize(function(){
        resizeDescriptionBlocks();
    });         

    function resizeDescriptionBlocks(){
        var height = $("#content").height();
        $(".description").height((height/2)-$("header").height());
    }

	
});




