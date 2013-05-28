$(document).ready(function(){

	var user = {};


	// fonctionne bizarrement
	function getURLParameter(name) {
		return decodeURI(
			(RegExp(name + '=' + '(.+?)(&|$|#)').exec(location.search)||[,null])[1]
		);
	}

	// fait maison
	function getUrlParam(name){
		var url = window.location.href,
			re = new RegExp('(#|&|$)'),
			param = url.search(name);

		url = url.substr(param+name.length+1);
		param = url.search(re);
		if(param == -1) return url;
		else return url.substr(0, param);;
	}
	
	var foursquareAPI = {
		clientId: '0PCSDR4BPTWOSAHNTQQX2Z4C2JCBLZGA3BO5GC5N0E2510BV',
		clientSecret: 'IOWDTFOLWYJZ0GAULQNDYGNVPFIUMN11KV4CZGRKE1GYVI1U',
		redirectUrl: 'http://localhost:8888/dataviz/ok.html',
		token: getUrlParam('access_token'),
		apiUrl: 'https://api.foursquare.com/v2',

		selfInfoUrl: function(){
			if(this.token){
				var url = this.apiUrl + '/users/self';
					url += '?oauth_token='+this.token;
				return url;
			}
		}
	};

	jQuery.ajax({
		type: 'GET',
		dataType: 'json',
		url: foursquareAPI.selfInfoUrl(),
		success: function(data, textStatus, jqXHR) {
			console.log(textStatus);
			// console.log(data);

			initUser(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('KO');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	function initUser(data){
		console.log(data.response.user.firstName);
		user.lastName = data.response.user.lastName;
		user.firstName = data.response.user.firstName;
	}


	



});