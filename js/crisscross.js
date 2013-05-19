$(document).ready(function(){
	function getURLParameter(name) {
		return decodeURI(
			(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		);
	}

	var foursquareAPI = {
		clientId: '0PCSDR4BPTWOSAHNTQQX2Z4C2JCBLZGA3BO5GC5N0E2510BV',
		clientSecret: 'IOWDTFOLWYJZ0GAULQNDYGNVPFIUMN11KV4CZGRKE1GYVI1U',
		redirectUrl: 'http://localhost/dataviz/ok.html',
		responseCode: getURLParameter('code'),

		accessTokenUrlProvider: function(){
			var url = 'https://foursquare.com/oauth2/access_token';
			url += '?client_id='+ this.clientId;
			url += '&client_secret='+ this.clientSecret;
			url += '&grant_type=authorization_code';
			url += '&redirect_uri='+ this.redirectUrl;
			url += '&code='+ this.responseCode;

			return url;
		}
	}

	jQuery.ajax({
		type: 'GET',
		url: foursquareAPI.accessTokenUrlProvider(),
		success: function(data, textStatus, jqXHR) {
			console.log('OK');
			console.log(data);
			console.log(textStatus);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('KO');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
});