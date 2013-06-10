var user = {};
var json = {};

$(document).ready(function(){

	user.init = function(data){

		console.log(data.response);
		
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
			url: "https://api.foursquare.com/v2/users/self/checkins?limit=250&oauth_token="+getUrlParam('access_token'),
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

	//Scale D3 pour calculer la distance en px correspondant à la distance du check sur l'échelle exp
	var scaleDistance = d3.scale.linear()
	        .domain([0, 2, 5, 20, 300])
                    .range([0, 50, 100, 150, 200]);

            var scaleHour = d3.scale.linear()
	        .domain([0, 86400])
                    .range([0, 1]);

             console.log(scaleDistance(20));

             console.log(scaleHour(80400));

             user.getCheckins = function(){
		var lat,
		      lng;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address":user.city}, function(data,status){
			if(status=='OK'){
				console.log("Ville : "+user.city)
				lat=data[0].geometry.location.lat();
				lng=data[0].geometry.location.lng();
			}else{
				//Si aucun resultat sur l'api de google maps
				console.log("Aucun résultat, calcul du barycentre :");
				var totalLat = 0,
					totalLng = 0;
					
				$.each(user.checkins, function (index, value) {
					totalLat = totalLat + value.venue.location.lat;
					totalLng = totalLng + value.venue.location.lng;
				})
				//calcul de la moyenne
				lat = totalLat/(user.checkins.length);
				lng = totalLng/(user.checkins.length);
			}
			console.log("Lattitude: "+lat);
			console.log("Longitude: "+lng);
			
			//On set le point de depart pour calculer les distances
			var point1 = new google.maps.LatLng(lat, lng);
			//Variable de max et point2
			var distance = 0;
			//Parcours des checkins
			$.each(user.checkins, function (index, value) {
				//Set du point 2 (checkin parcouru) pour le calcul
				var point2 = new google.maps.LatLng((value.venue.location.lat),(value.venue.location.lng));
				//Calcul de la distance et test si c'est la valeur maximale
				distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
				if(distance>maxDistance){
					maxDistance = distance;
				}
			})
			console.log("Check le plus loin : "+(maxDistance/1000)+" km");
			//Test final selon la valeur max pour definir la classification
			if(maxDistance<50000){
				console.log("Resultat : Sédentaire !");
			}else if(maxDistance<400000){
				console.log("Resultat : Nomade !");
			}else{
				console.log("Resultat : Voyageur !");	
			}
		});
		
	}
	
	user.getHour = function(){
		var coucheTard = 0,
			insomniaque = 0,
			matinal = 0,
			diurne = 0,
			heure = 3600;
			
		$.each(user.checkins, function (index, value) {
			var hr = value.createdAt%86400;
			
			if(hr<6*heure){
				insomniaque++;
			}else if(hr<12*heure){
				matinal = matinal + 1;
			}else if(hr<19*heure){
				diurne++;
			}else{
				coucheTard++;
			}
		})
		
		var max = Math.max(coucheTard, insomniaque ,matinal ,diurne);
		console.log("tard :"+coucheTard);
		console.log("matin :"+matinal);
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
	
	user.getDistance = function(){
		var lat,
			lng;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address":user.city}, function(data,status){
			if(status=='OK'){
				console.log("Ville : "+user.city)
				lat=data[0].geometry.location.lat();
				lng=data[0].geometry.location.lng();
			}else{
				//Si aucun resultat sur l'api de google maps
				console.log("Aucun résultat, calcul du barycentre :");
				var totalLat = 0,
					totalLng = 0;
					
				$.each(user.checkins, function (index, value) {
					totalLat = totalLat + value.venue.location.lat;
					totalLng = totalLng + value.venue.location.lng;
				})
				//calcul de la moyenne
				lat = totalLat/(user.checkins.length);
				lng = totalLng/(user.checkins.length);
			}
			console.log("Lattitude: "+lat);
			console.log("Longitude: "+lng);
			
			//On set le point de depart pour calculer les distances
			var point1 = new google.maps.LatLng(lat, lng);
			//Variable de max et point2
			var maxDistance = 0,
				distance = 0;
			//Parcours des checkins
			$.each(user.checkins, function (index, value) {
				//Set du point 2 (checkin parcouru) pour le calcul
				var point2 = new google.maps.LatLng((value.venue.location.lat),(value.venue.location.lng));
				//Calcul de la distance et test si c'est la valeur maximale
				distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
				if(distance>maxDistance){
					maxDistance = distance;
				}
			})
			console.log("Check le plus loin : "+(maxDistance/1000)+" km");
			//Test final selon la valeur max pour definir la classification
			if(maxDistance<50000){
				console.log("Resultat : Sédentaire !");
			}else if(maxDistance<400000){
				console.log("Resultat : Nomade !");
			}else{
				console.log("Resultat : Voyageur !");	
			}
		});
		
	}
	
	user.getMayorship = function(){
		console.log("Nb Mayorship : "+user.mayorshipNumber);
		if(user.mayorshipNumber==0){
			console.log("Resultat : Candidat");
		}else if(user.mayorshipNumber<25){
			console.log("Resultat : Conseiller général");
		}else if(user.mayorshipNumber<50){
			console.log("Resultat : Député");	
		}else{
			console.log("Resultat : Président");	
		}
	}
	
	user.getCheck = function(){
		var recent = 0,
			ancien = Math.floor((new Date()));
			
		$.each(user.checkins, function (index, value) {
			if(value.createdAt<ancien){
				ancien = value.createdAt;
			}
			if(value.createdAt>recent){
				recent = value.createdAt;
			}
		})
		
		console.log("Check plus recent : "+recent);
		console.log("Check plus ancien : "+ancien);
		console.log("Nb de check dans le tableau : "+user.checkins.length);
		
		//Calcul de la moyenne
		var moyCheck = Math.floor((user.checkins.length)/Math.floor((recent-ancien)/86400));
		console.log("Moyenne de checks : "+moyCheck+" /jour");
		
		if(moyCheck==0){
			console.log("Resultat : Flemmard");
		}else if(moyCheck<4){
			console.log("Resultat : Frétillant");
		}else{
			console.log("Resultat : Hyper-actif");	
		}
	}
	
	user.getTip = function(){
		console.log("Nb Tips : "+user.tipsNumber);
		if(user.tipsNumber<2){
			console.log("Resultat : Egoïste");
		}else if(user.tipsNumber<6){
			console.log("Resultat : Avare");
		}else if(user.tipsNumber<20){
			console.log("Resultat : Charitable");	
		}else{
			console.log("Resultat : Bienfaisant");	
		}
	}
	
	user.getFollow = function(){
		console.log("Nb Follows : "+user.followNumber);
		if(user.followNumber<4){
			console.log("Resultat : Marginal");
		}else if(user.followNumber<15){
			console.log("Resultat : Groupie");
		}else{
			console.log("Resultat : Mouton");	
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