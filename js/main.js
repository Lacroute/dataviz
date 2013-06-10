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

	
});




