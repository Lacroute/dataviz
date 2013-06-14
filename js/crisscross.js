var user = {};
var json = {};
json.checkins = [];
json.tips = [];
json.maxChecks = [];
json.categories = [];
json.dailyAvgChecks = [];
json.tipsAvg = [];
json.general = {};
json.badges = [];
var noteGlobale = 0;

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
		user.friends = data.response.user.friends.count;
		user.badges = data.response.user.badges.count;
		
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
			var distance = 0,
				maxDistance=0;
			var hour = 0;
			json.badges[5]={};
			//Parcours des checkins
			$.each(user.checkins, function (index, value) {
				//Set du point 2 (checkin parcouru) pour le calcul
				var point2 = new google.maps.LatLng((value.venue.location.lat),(value.venue.location.lng));
				//Calcul de la distance et test si c'est la valeur maximale
				distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
				if(distance>maxDistance){
			                 maxDistance = distance;
			             }
				hour = value.createdAt+7200;
				json.checkins[index] = {} ;
				json.checkins[index].h = scaleHour(hour%86400);
				if(distance>300000){
					distance=300000;
				}
				json.checkins[index].d = scaleDistance(distance) ;
			})

			if(maxDistance<50000){
			     json.badges[5].label="sédentaire";
			     json.badges[5].description="Toi tu n'aimes pas trop t'éloigner de chez toi. Tu sais, le monde est merveilleux alors bouge toi !";
			 }else if(maxDistance<400000){
			     json.badges[5].label="nomade";
			     json.badges[5].description="Tu aimes bien te balader mais n'aies pas peur, va encore plus loin !";
			 }else{
			     json.badges[5].label="voyageur";
			     json.badges[5].description="Ça voyage, ça voyage… Tu connais la France comme ta poche mais tu sais, les autres pays sont plutôt cool aussi.";   
			 }

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
		 json.badges[6]={};
		if(user.tipsNumber<2){
			json.badges[6].label="égoïste";
			json.badges[6].description="Oh le vilain, tu n'as aucun tip à ton actif... Qu'est ce que tu attends pour laisser une trace sur les endroits où tu checks ?";
		 }else if(user.tipsNumber<6){
		     	json.badges[6].label="avare";
			json.badges[6].description="C'est bien mais c'est peu. On peut dire qu'il y a de l'idée mais on compte sur toi pour laisser encore plus de tips !";
		 }else if(user.tipsNumber<20){
		     	json.badges[6].label="charitable";
			json.badges[6].description="Tu es ce qu'on appelle une âme charitable. C'est plutôt généreux de ta part, la communauté te remercie !"; 
		 }else{
		     	json.badges[6].label="bienfaisant";
			json.badges[6].description="Bravo, tu es bienfaisant pour la communauté ! Grâce à toi, les autres peuvent bénéficier de tes super conseils.";
		 }
		 if(user.tipsNumber>15){
			noteGlobale = noteGlobale + 15;
		}else{
			noteGlobale = noteGlobale + user.tipsNumber;
		}
	}
	
	user.getHours = function(){
		var coucheTard = 0,
			insomniaque = 0,
			matinal = 0,
			diurne = 0,
			heure = 3600;
			
		if(user.checkins.length>0){
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
		}
		
		var max = Math.max(coucheTard, insomniaque ,matinal ,diurne);

		json.maxChecks[0]={};
		json.maxChecks[1]={};
		json.general.hour={};
		
		json.badges[4]={};

		if(max==0){
			json.maxChecks[0].h=0;
			json.maxChecks[1].h=0;
			json.badges[4].label="";
			json.badges[4].description="";
		}else if(max==coucheTard){
			json.maxChecks[0].h=19;
			json.maxChecks[1].h=24;
			json.badges[4].label="couche-tard";
			json.badges[4].description="Tu aimes checker le soir. Tu dois sans doute beaucoup sortir avec tes amis. Essaye de ne pas accumuler la fatigue !";
		}else if(max==matinal){
			json.maxChecks[0].h=6;
			json.maxChecks[1].h=12;
			json.badges[4].label="matinal";
			json.badges[4].description="Toi tu aimes te lever tôt. Autorise toi une grasse matinée de temps de temps, cela ne fait pas de mal !";
		}else if(max==diurne){
			json.maxChecks[0].h=12;
			json.maxChecks[1].h=19;	
			json.badges[4].label="diurne";
			json.badges[4].description="Tu checkes principalement la journée. Tout est normal chez toi, rien à signaler !";
		}else{
			json.maxChecks[0].h=0;
			json.maxChecks[1].h=6;	
			json.badges[4].label="insomniaque";
			json.badges[4].description="Apparemment tu checkes souvent la nuit… Soit tu vis à l'envers des êtres humains normaux, soit tu es un vampire, ouuh...";
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
		 culture =  ('0' + culture).slice(-2);
		 universitaire=  ('0' + universitaire).slice(-2);
		 manger=  ('0' + manger).slice(-2);
		 nocturne=  ('0' + nocturne).slice(-2);
		 ext=  ('0' + ext).slice(-2);
		 pro=  ('0' + pro).slice(-2);
		 residence=  ('0' + residence).slice(-2);
		 boutique=  ('0' + boutique).slice(-2);
		 voyage=  ('0' + voyage).slice(-2);
	    	json.categories=[{name: 'Culture et loisirs', count: scaleCategorie(culture), nb: culture}, {name: 'Établissement universitaire', count: scaleCategorie(universitaire), nb: universitaire}, {name: 'Manger', count: scaleCategorie(manger), nb: manger}, {name: 'Vie nocturne', count: scaleCategorie(nocturne), nb: nocturne}, {name: 'Extérieur et loisirs', count: scaleCategorie(ext), nb: ext}, {name: 'Lieux professionnels ou autres', count: scaleCategorie(pro), nb: pro}, {name: 'Résidence', count: scaleCategorie(residence), nb: residence}, {name: 'Boutiques et services', count: scaleCategorie(boutique), nb: boutique}, {name: 'Voyages et transport', count: scaleCategorie(voyage), nb: voyage}];

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

	user.getFriends = function(){
	     json.badges[2]={};
	     if(user.friends<10){
	         json.badges[2].label="solitaire";
	         json.badges[2].description="Tu es un solitaire dans l'âme. Fais attention à ne pas te couper du monde !";
	         user.friends = ('0' + user.friends).slice(-2);
	     }else if(user.friends<80){
	         json.badges[2].label="sociable";
	         json.badges[2].description="Tu es quelqu'un de sociable, c'est très bien. Ne change pas !";
	     }else{
	         json.badges[2].label="star";
	         json.badges[2].description="Bravo, tu es une star ! Les gens t'adorent, tu as vraiment beaucoup d'amis. Mais fais attention, parfois la qualité vaut mieux que la quantité…";
	     }
	     json.badges[2].nb=user.friends;
	     if((user.friends/5)>15){
			noteGlobale = noteGlobale + 15;
		}else{
			noteGlobale = noteGlobale + Math.floor(user.friends/5);
		}
	}

	user.getMayorship = function(){
	     json.badges[0]={};
	     if(user.mayorshipNumber==0){
	         json.badges[0].label="candidat";
	         json.badges[0].description="Tu n'as jamais été maire. Soit tu débutes sur Foursquare, soit tu n'es pas du tout actif. Allez, on s'active !";
	     }else if(user.mayorshipNumber<25){
	         json.badges[0].label="conseiller général";
	         json.badges[0].description="C'est un bon début. Mais tu peux faire mieux, allez !";
	     }else if(user.mayorshipNumber<50){
	         json.badges[0].label="député";
	         json.badges[0].description="C'est plutôt pas mal ça..! Encore un petit effort et ce sera parfait !";
	     }else{
	         json.badges[0].label="président";
	         json.badges[0].description="Félicitations, tu as acquis le statut de président ! Tu es plus de 50 fois maire de lieux différents."; 
	      }
		  if((user.mayorshipNumber*2)>25){
			noteGlobale = noteGlobale + 25;
		}else{
			noteGlobale = noteGlobale + (user.mayorshipNumber*2);
		}
	}

	user.getFrequence = function(){
	     var recent = 0,
	         ancien = Math.floor((new Date()));
	            
	     if(user.checkins.length>0){
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
		}else{
			moyCheck=0;
		}
	      json.badges[1]={};
	      json.badges[1].nb=moyCheck;
	     if(moyCheck<3){
	         json.badges[1].label="flemmard";
	         json.badges[1].description="Oh le flemmard ! Et bien, qu'est ce que tu attends pour checker ?";
	     }else if(moyCheck<8){
	         json.badges[1].label="frétillant";
	         json.badges[1].description="Tu es dans la moyenne, c'est bien. Essaye de frétiller un peu plus pour voir…";
	     }else{
	         json.badges[1].label="hyper-actif";
	         json.badges[1].description="Ah ça pour checker, ça check ! Attention à ne pas passer ta vie sur Foursquare ;)";
	     }
	     if((user.moyCheck*5)>5){
			noteGlobale = noteGlobale + 20;
		}else{
			noteGlobale = noteGlobale + (moyCheck*5);
		}

	}

	user.getFollow = function(){
	 	json.badges[3]={};
		 if(user.followNumber<4){
		    	 json.badges[3].label="marginal";
	         		json.badges[3].description="Tu aimes te différencier des autres et ne pas te fondre dans le moule, mais attention à ne pas rejeter tout ce qui t'entoure !";
		 }else if(user.followNumber<15){
		     	json.badges[3].label="groupie";
	         		json.badges[3].description="Tu es une groupie mais cela reste raisonnable. Attention à ne pas tomber dans les excès !";
		 }else{
		     	json.badges[3].label="mouton";
	         		json.badges[3].description="Tu suis tellement de choses qu'on pourrait croire que tu n'as aucune personnalité…";
		 }
		 if((user.followNumber/3)>5){
			noteGlobale = noteGlobale + 5;
		}else{
			noteGlobale = noteGlobale + Math.floor(user.followNumber/3);
		}
	}

	user.getBadges = function(){
		if((user.badges*2)>20){
			noteGlobale = noteGlobale + 20;
		}else{
			noteGlobale = noteGlobale + (user.badges*2);
		}
	}

	user.getGeneral = function(){
		var textNote;
		if(noteGlobale<11){
			textNote = "C'est vraiment une toute petite note ça dis donc… Soit tu es tout nouveau sur Foursquare, soit tu as oublié que tu avais un compte. Allez on se remue !";
		}else if(noteGlobale<31){
			textNote = "C'est un tout petit début. N'hésites pas à checker dès que tu te déplaces, motive toi !";
		}else if(noteGlobale<51){
			textNote = "Tu es juste en dessous de la moyenne, c'est pas si mal mais c'est pas fou non plus, ne te décourage surtout pas !";
		}else if(noteGlobale<71){
			textNote = "Au dessus de la moyenne, \"ouf\" comme on dit. Y'a pas de rattrapage mais faut pas lâcher l'affaire pour autant !";
		}else if(noteGlobale<91){
			textNote = "Ça se rapproche de la perfection là. Il reste encore un tout petit effort à faire, mais t'inquiètes pas, tu es déjà très bien.";
		}else{
			textNote = "Alors là, félicitations, tu es vraiment très actif ! Ça check, ça follow, ça donne des conseils, tu es aussi de très nombreuses fois maires. Rien à dire, continue comme ça, on t'embrasse !";
		}
		json.general={nom_complet: user.firstName+" "+user.lastName, prenom: user.firstName, photo: user.photo, note: noteGlobale, nbtips: user.tipsNumber, txtNote: textNote};
	}

	user.getJson = function(){
		 user.getTips();
		 user.getHours();
		 user.getCategories();
		 user.getDailyAvgChecks();
		 user.getTipsAvg();
		 user.getCheckins();
		 user.getMayorship();
		 user.getFrequence();
		 user.getFollow();
		 user.getFriends();
		 user.getBadges();
		 user.getGeneral();
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
			user.getJson();
		},
		async: false,
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('KO');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});