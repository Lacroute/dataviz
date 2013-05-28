var user = {};

$(document).ready(function(){

	user.init = function(data){
		
		user.id = data.response.user.id;
		user.lastName = data.response.user.lastName;
		user.firstName = data.response.user.firstName;
		user.city = data.response.user.homeCity;
		user.mayorshipNumber = data.response.user.mayorships.count;
		user.tipsNumber = data.response.user.tips.count;
		user.followNumber = data.response.user.following.count;
		user.checkinsNumber = data.response.user.checkins.count;
		
		//checkins
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			url: "https://api.foursquare.com/v2/users/self/checkins?limit=200&oauth_token="+getUrlParam('access_token'),
			success: function(data, textStatus, jqXHR) {
				console.log(textStatus);
				user.checkins = data.response.checkins.items;
				},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('KO');
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
		console.log(user);
		
	}
	
	user.getHour = function(){
		var coucheTard = 0,
			insomniaque = 0,
			matinal = 0,
			diurne = 0;
			
		$.each(user.checkins, function (index, value) {
			var hr = value.createdAt%86400;
			var heure = 3600;
			
			if(hr<2*heure){
				coucheTard++;
				console.log("coucheTard");
			}else if(hr<6*heure){
				insomniaque++;
				console.log("insomniaque");
			}else if(hr<10*heure){
				matinal = matinal + 1;
				console.log("matinal");
			}else if(hr<22*heure){
				diurne++;
				console.log("diurne");
			}else{
				coucheTard++;
				console.log("coucheTard");
			}
		})
		
		var max = Math.max(coucheTard, insomniaque ,matinal ,diurne);
		console.log("tard :"+coucheTard);
		console.log("atin :"+matinal);
		console.log("diurne :"+diurne);
		console.log("insomniaque:"+insomniaque);
		
		if(max==coucheTard){
			console.log("Resultat : Couche tard !");
		}else if(max==matinal){
			console.log("Resultat : Matinal !");
		}else if(max==diurne){
			console.log("Resultat : Diurne !");	
		}else{
			console.log("Resultat : Insomniaque !");	
		}
	}


	// Fonction de Clément pour récuperer le Token dans l'url
	function getUrlParam(name){
		var url = window.location.href,
			re = new RegExp('(#|&|$)'),
			param = url.search(name);

		url = url.substr(param+name.length+1);
		param = url.search(re);
		if(param == -1) return url;	
		else return url.substr(0, param);;
	}
	
	// Init de l'objet foursquareAPI
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

	//On lance la requete qui retourne les données de l'API relative à l'user connecté
	jQuery.ajax({
		type: 'GET',
		dataType: 'json',
		url: foursquareAPI.selfInfoUrl(),
		success: function(data, textStatus, jqXHR) {
			console.log(textStatus);
			// console.log(data);

			//on appelle la fonction qui initailise les données de l'user
			user.init(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('KO');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});



});