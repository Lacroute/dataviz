$(document).ready(function(){
	var foursquareConnector = {
		clientId: '0PCSDR4BPTWOSAHNTQQX2Z4C2JCBLZGA3BO5GC5N0E2510BV',
		clientSecret: 'IOWDTFOLWYJZ0GAULQNDYGNVPFIUMN11KV4CZGRKE1GYVI1U',
		// redirectUrl: 'http://omnisquare.alwaysdata.net/me.html',
		redirectUrl: 'http://localhost:8888/dataviz/me.html',
		authenticate: function(){
			var url = "https://fr.foursquare.com/oauth2/authenticate";
			url += "?client_id="+this.clientId;
			url += '&response_type=token';
			url += "&redirect_uri="+this.redirectUrl;

			window.location.replace(url);
		}
	};
	$('#foursquareConnect').click(function(event){
		event.preventDefault();
		foursquareConnector.authenticate();
	});
});