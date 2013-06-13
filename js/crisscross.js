var user = {};
var json = {};
json.checkins = [];
json.tips = [];
json.maxChecks = [];
json.categories = [];
json.dailyAvgChecks = [];
json.tipsAvg = [];
json.general = {};

	user.init = function(data){

		console.log(data.response);
		
		user.id = data.response.user.id;
		user.lastName = data.response.user.lastName;
		user.firstName = data.response.user.firstName;
		user.photo = data.response.user.photo;
		user.city = data.response.user.homeCity;
		user.mayorshipNumber = data.response.user.mayorships.count;
		user.tips = data.response.user.tips
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
			async: false,
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('KO');
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
		//tips
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			url: "https://api.foursquare.com/v2/users/self/tips?oauth_token="+getUrlParam('access_token'),
			success: function(data, textStatus, jqXHR) {
				console.log(textStatus);
				user.tips = data.response.tips.items;
			},
			async: false,
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
	        .domain([0, 2000, 20000, 300000])
                    .range([0, 50, 100, 150]);

            var scaleHour = d3.scale.linear()
	        .domain([0, 86400])
                    .range([0, 24]);

            var scaleCategorie = d3.scale.linear()
	        .domain([0, 10, 40, 100])
                    .range([0, 50, 100, 150]);

            var scaleAvgChecks = d3.scale.linear()
	        .domain([0, 5])
                    .range([0, 24]);

             var scaleTips = d3.scale.linear()
	        .domain([0, 20])
                    .range([0, 24]);

             user.getCheckins = function(){
		var lat,
		      lng;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address":user.city}, function(data,status){
			if(status=='OK'){
				lat=data[0].geometry.location.lat();
				lng=data[0].geometry.location.lng();
			}else{
				//Si aucun resultat sur l'api de google maps
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
			
			//On set le point de depart pour calculer les distances
			var point1 = new google.maps.LatLng(lat, lng);
			//Variable de max et point2
			var distance = 0;
			var hour = 0;
			//Parcours des checkins
			$.each(user.checkins, function (index, value) {
				//Set du point 2 (checkin parcouru) pour le calcul
				var point2 = new google.maps.LatLng((value.venue.location.lat),(value.venue.location.lng));
				//Calcul de la distance et test si c'est la valeur maximale
				distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
				hour = value.createdAt+7200;
				json.checkins[index] = {} ;
				json.checkins[index].h = scaleHour(hour%86400);
				if(distance>300000){
					distance=300000;
				}
				json.checkins[index].d = scaleDistance(distance) ;
			})
			setBadges();
			magic();
		});
		
	}

	user.getTips = function(){
		$.each(user.tips, function (index, value) {
				hour = value.createdAt+7200;
				json.tips[index] = {} ;
				json.tips[index].h = scaleHour(hour%86400);
			})
	}
	
	user.getHours = function(){
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

		json.maxChecks[0]={};
		json.maxChecks[1]={};
		
		if(max==coucheTard){
			json.maxChecks[0].h=19;
			json.maxChecks[1].h=24;
		}else if(max==matinal){
			json.maxChecks[0].h=6;
			json.maxChecks[1].h=12;
		}else if(max==diurne){
			json.maxChecks[0].h=12;
			json.maxChecks[1].h=19;	
		}else{
			json.maxChecks[0].h=0;
			json.maxChecks[1].h=6;	
		}
	}

	user.getCategories = function(){
	    var culture=0,
	    universitaire=0,
	    manger=0,
	    nocturne=0,
	    ext=0,
	    pro=0,
	    residence=0,
	    boutique=0,
	    voyage=0;
	    $.each(user.checkins, function (index, value) {
	    	if(value.venue.categories.length>0){
	    		if((value.venue.categories[0].parents[0]=="Culture et loisirs")&&(culture<100)){
	    			culture++;
	    		}else if((value.venue.categories[0].parents[0]=="Établissement universitaire")&&(universitaire<100)){
	    			universitaire++;
	    		}else if((value.venue.categories[0].parents[0]=="Manger")&&(manger<100)){
	    			manger++;
	    		}else if((value.venue.categories[0].parents[0]=="Vie nocturne")&&(nocturne<100)){
	    			nocturne++;
	    		}else if((value.venue.categories[0].parents[0]=="Extérieur et loisirs")&&(ext<100)){
	    			ext++;
	    		}else if((value.venue.categories[0].parents[0]=="Lieux professionnels ou autres")&&(pro<100)){
	    			pro++;
	    		}else if((value.venue.categories[0].parents[0]=="Résidence")&&(residence<100)){
	    			residence++;
	    		}else if((value.venue.categories[0].parents[0]=="Boutiques et services")&&(boutique<100)){
	    			boutique++;
	    		}else if((value.venue.categories[0].parents[0]=="Voyages et transport")&&(voyage<100)){
	    			voyage++;
	    		}
	    	}
	    })
	    	json.categories=[{name: 'Culture et loisirs', count: scaleCategorie(culture)}, {name: 'Établissement universitaire', count: scaleCategorie(universitaire)}, {name: 'Manger', count: scaleCategorie(manger)}, {name: 'Vie nocturne', count: scaleCategorie(nocturne)}, {name: 'Extérieur et loisirs', count: scaleCategorie(ext)}, {name: 'Lieux professionnels ou autres', count: scaleCategorie(pro)}, {name: 'Résidence', count: scaleCategorie(residence)}, {name: 'Boutiques et services', count: scaleCategorie(boutique)}, {name: 'Voyages et transport', count: scaleCategorie(voyage)}];

	}

	user.getDailyAvgChecks = function(){
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
		
		//Calcul de la moyenne
		var moyCheck = Math.floor((user.checkins.length)/Math.floor((recent-ancien)/86400));
		
		if(moyCheck>5){
			moyCheck=5;
		}
		json.dailyAvgChecks = [{h:0}, {h:scaleAvgChecks(moyCheck)}];
	}

	user.getTipsAvg = function(){
		var tips = user.tipsNumber;
		if(tips>20){
			tips = 20;
		}
		json.tipsAvg = [{h:0}, {h:scaleTips(tips)}];
	}

	user.getGeneral = function(){
		json.general={nom: user.firstName+" "+user.lastName, photo: user.photo};
	}

	user.getJson = function(){
		 user.getTips();
		 user.getHours();
		 user.getCategories();
		 user.getDailyAvgChecks();
		 user.getTipsAvg();
		 user.getGeneral();
		 user.getCheckins();
	}

	// user.getHour = function(){
	// 	var coucheTard = 0,
	// 		insomniaque = 0,
	// 		matinal = 0,
	// 		diurne = 0,
	// 		heure = 3600;
			
	// 	$.each(user.checkins, function (index, value) {
	// 		var hr = value.createdAt%86400;
			
	// 		if(hr<6*heure){
	// 			insomniaque++;
	// 		}else if(hr<12*heure){
	// 			matinal = matinal + 1;
	// 		}else if(hr<19*heure){
	// 			diurne++;
	// 		}else{
	// 			coucheTard++;
	// 		}
	// 	})
		
	// 	var max = Math.max(coucheTard, insomniaque ,matinal ,diurne);
	// 	console.log("tard :"+coucheTard);
	// 	console.log("matin :"+matinal);
	// 	console.log("diurne :"+diurne);
	// 	console.log("insomniaque:"+insomniaque);
		
	// 	if(max==coucheTard){
	// 		console.log("Resultat : Couche tard !");
	// 	}else if(max==matinal){
	// 		console.log("Resultat : Matinal !");
	// 	}else if(max==diurne){
	// 		console.log("Resultat : Diurne !");	
	// 	}else{
	// 		console.log("Resultat : Insomniaque !");	
	// 	}
	// }
	
	// user.getDistance = function(){
	// 	var lat,
	// 		lng;
	// 	var geocoder = new google.maps.Geocoder();
	// 	geocoder.geocode({"address":user.city}, function(data,status){
	// 		if(status=='OK'){
	// 			console.log("Ville : "+user.city)
	// 			lat=data[0].geometry.location.lat();
	// 			lng=data[0].geometry.location.lng();
	// 		}else{
	// 			//Si aucun resultat sur l'api de google maps
	// 			console.log("Aucun résultat, calcul du barycentre :");
	// 			var totalLat = 0,
	// 				totalLng = 0;
					
	// 			$.each(user.checkins, function (index, value) {
	// 				totalLat = totalLat + value.venue.location.lat;
	// 				totalLng = totalLng + value.venue.location.lng;
	// 			})
	// 			//calcul de la moyenne
	// 			lat = totalLat/(user.checkins.length);
	// 			lng = totalLng/(user.checkins.length);
	// 		}
	// 		console.log("Lattitude: "+lat);
	// 		console.log("Longitude: "+lng);
			
	// 		//On set le point de depart pour calculer les distances
	// 		var point1 = new google.maps.LatLng(lat, lng);
	// 		//Variable de max et point2
	// 		var maxDistance = 0,
	// 			distance = 0;
	// 		//Parcours des checkins
	// 		$.each(user.checkins, function (index, value) {
	// 			//Set du point 2 (checkin parcouru) pour le calcul
	// 			var point2 = new google.maps.LatLng((value.venue.location.lat),(value.venue.location.lng));
	// 			//Calcul de la distance et test si c'est la valeur maximale
	// 			distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
	// 			if(distance>maxDistance){
	// 				maxDistance = distance;
	// 			}
	// 		})
	// 		console.log("Check le plus loin : "+(maxDistance/1000)+" km");
	// 		//Test final selon la valeur max pour definir la classification
	// 		if(maxDistance<50000){
	// 			console.log("Resultat : Sédentaire !");
	// 		}else if(maxDistance<400000){
	// 			console.log("Resultat : Nomade !");
	// 		}else{
	// 			console.log("Resultat : Voyageur !");	
	// 		}
	// 	});
		
	// }
	
	// user.getMayorship = function(){
	// 	console.log("Nb Mayorship : "+user.mayorshipNumber);
	// 	if(user.mayorshipNumber==0){
	// 		console.log("Resultat : Candidat");
	// 	}else if(user.mayorshipNumber<25){
	// 		console.log("Resultat : Conseiller général");
	// 	}else if(user.mayorshipNumber<50){
	// 		console.log("Resultat : Député");	
	// 	}else{
	// 		console.log("Resultat : Président");	
	// 	}
	// }
	
	// user.getCheck = function(){
	// 	var recent = 0,
	// 		ancien = Math.floor((new Date()));
			
	// 	$.each(user.checkins, function (index, value) {
	// 		if(value.createdAt<ancien){
	// 			ancien = value.createdAt;
	// 		}
	// 		if(value.createdAt>recent){
	// 			recent = value.createdAt;
	// 		}
	// 	})
		
	// 	console.log("Check plus recent : "+recent);
	// 	console.log("Check plus ancien : "+ancien);
	// 	console.log("Nb de check dans le tableau : "+user.checkins.length);
		
	// 	//Calcul de la moyenne
	// 	var moyCheck = Math.floor((user.checkins.length)/Math.floor((recent-ancien)/86400));
	// 	console.log("Moyenne de checks : "+moyCheck+" /jour");
		
	// 	if(moyCheck==0){
	// 		console.log("Resultat : Flemmard");
	// 	}else if(moyCheck<4){
	// 		console.log("Resultat : Frétillant");
	// 	}else{
	// 		console.log("Resultat : Hyper-actif");	
	// 	}
	// }
	
	// user.getTip = function(){
	// 	console.log("Nb Tips : "+user.tipsNumber);
	// 	if(user.tipsNumber<2){
	// 		console.log("Resultat : Egoïste");
	// 	}else if(user.tipsNumber<6){
	// 		console.log("Resultat : Avare");
	// 	}else if(user.tipsNumber<20){
	// 		console.log("Resultat : Charitable");	
	// 	}else{
	// 		console.log("Resultat : Bienfaisant");	
	// 	}
	// }
	
	// user.getFollow = function(){
	// 	console.log("Nb Follows : "+user.followNumber);
	// 	if(user.followNumber<4){
	// 		console.log("Resultat : Marginal");
	// 	}else if(user.followNumber<15){
	// 		console.log("Resultat : Groupie");
	// 	}else{
	// 		console.log("Resultat : Mouton");	
	// 	}
	// }


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
			user.getJson();
		},
		async: false,
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('KO');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});