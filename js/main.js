$(document).ready(function(){

$('#openMenu').on('click', function(event){
	event.preventDefault();
	$('#content').toggleClass('on');
});

$('#openNote').on('click', function(event){
	event.preventDefault();
	$('#note').toggleClass('on');
});

$('#closeNote').on('click', function(event){
	event.preventDefault();
	$('#note').toggleClass('on');
});

$('#menu').on('click', function(event){
	event.preventDefault();
	$('#content').toggleClass('on');
});
	
});




