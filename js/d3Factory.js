function magic(){

	/*** Initialisation des variables ***/
	var svg = d3.select('#pool').append('svg:svg'),
		o = {x:300, y:330}, // point origine
		pi = Math.PI,
		rcat = [10, 40, '100+'], // rayon de distance
		ro = 50, // rayon origine
		rdist = [2, 20, '300+'], // rayon de distance check
		rh = ro*4.5, // rayon horaire
		rvi = rh+19, // rayon vert interne
		rvii = rh+25, // rayon vert interne invisible
		rve = rh+40, // rayon vert externe
		rd = ro*6, // rayon décoration
		h = [{h:0, t:'0h'}, {h:3, t:'3h'}, {h:6, t:'6h'}, {h:9, t:'9h'}, {h:12, t:'12h'}, {h:15, t:'15h'}, {h:18, t:'18h'}, {h:21, t:'21h'}], // horaires
		m = [{h:0, t:'0%'}, {h:6, t:'25%'}, {h:12, t:'50%'}, {h:18, t:'75%'}], // moyenne check
		checkJson = json.checkins;
		tipsJson = json.tips;
		checkAvgJson = json.maxChecks,
		catJson = json.categories,
		dailyAvgChecksJson = json.dailyAvgChecks,
		dailyAvgTipsJson = json.tipsAvg,
		decoJson = [{h:5}, {h:13}, {h:21}],
		bgc = '#00182b', // background color
		cc = '#fbfbfb', // check color
		rvc = ' #1abc9c', // rond vert color
		tc = '#2980b9', // tips color
		avgc = '#0a7dbc', // avg check color
		javgc = '#fbfbfb', // jauge avg check color
		cac = '#e74c3c',  // category color
		sr =  15.016; // soleil r

		/*** [END] Initialisation variables ***/

	/*** Initialisation json ***/
	h = textCoords(h);
	m = textCoords(m);
	checkJson = checkCoords(checkJson);
	checkAvgJson = checksAvgCoords(checkCoords(checkAvgJson));
	dailyAvgChecksJson = checksAvgCoords(checkCoords(dailyAvgChecksJson));
	dailyAvgTipsJson = checksAvgCoords(checkCoords(dailyAvgTipsJson));
	tipsJson = tipsCoords(tipsJson);
	catJson = catCoords(catJson);
	decoJson = decoCoords(decoJson);

	/*** [END] Initialisation json ***/

	/*** Initialisation décoration **/
	var origine = svg.append('circle').attr('id', 'origine').attr('r', 0).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 1),
		cerlceHoraire = svg.append('circle').attr('id', 'horaire').attr('class', 'echelleExterieur').attr('r', 0).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 1),
		cerlceVertInterne = svg.append('circle').attr('r', 0).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', rvc).style('stroke-width', 25),
		cerlceVertInterneInvisible = svg.append('circle').attr('r', 0).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke-dasharray',('2.5, 2.5')).style('stroke', bgc).style('stroke-width', 15),
		cerlceVertExterne = svg.append('circle').attr('class', 'echelleExterieur').attr('r', 0).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', cc).style('stroke-width', 1),
		echelleDeco = svg.append('circle').attr('class', 'echelleExterieur').attr('r', rve).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke-dasharray',('5, 5')).style('stroke', cc).style('stroke-width', 1).style('opacity', 0);

	var soleilCouchant = svg.append('g').attr('id', 'soleilCouchant').attr('class', 'deco');
	soleilCouchant.append('circle').attr('fill', '#F7931E').attr('cx', decoJson[0].x).attr('cy', decoJson[0].y).attr('r', sr);
	soleilCouchant.append('circle').attr('fill', 'none').attr('stroke', bgc).attr('stroke-width', 14).attr('stroke-dasharray', '5.272, 2.1088').attr('cx', decoJson[0].x + 0.334).attr('cy', decoJson[0].y - 0.057).attr('r', sr + 2.609);
	soleilCouchant.append('ellipse').attr('fill', bgc).attr('cx', decoJson[0].x + 0.104).attr('cy', decoJson[0].y + 8.745).attr('rx', 20.375).attr('ry', 11.688);

	var soleil = svg.append('g').attr('id', 'soleil').attr('class', 'deco');
	soleil.append('circle').attr('fill', '#F7931E').attr('cx', decoJson[1].x).attr('cy', decoJson[1].y).attr('r', sr);
	soleil.append('circle').attr('fill', 'none').attr('stroke', bgc).attr('stroke-width', 14).attr('stroke-dasharray', '5.272, 2.1088').attr('cx', decoJson[1].x + 0.334).attr('cy', decoJson[1].y - 0.057).attr('r', sr + 2.609);

	var lune = svg.append('g').attr('id', 'lune').attr('class', 'deco');
	lune.append('circle').attr('fill', '#E6E6E6').attr('cx', decoJson[2].x).attr('cy', decoJson[2].y).attr('r', sr-1.849);
	lune.append('circle').attr('fill', bgc).attr('cx', decoJson[2].x+7).attr('cy', decoJson[2].y-4).attr('r', sr-1.849);

	var deco = svg.selectAll('.deco').attr('opacity', 0);

	/*** [END] Initialisation décoration **/

	// Retourne un angle pour coordonnées polaires, ici demi cercle divisé en 12h dans le sens horaire avec un désalage de pi/2
	function getAlpha(h){
		return h*pi/12 -pi/2;
	}

	// Retourne y en fonction d'un angle, d'une abscisse d'origine (généralement o.x), et d'une distance
	function getX(alpha, offsetX, radius){
		return offsetX+radius*Math.cos(alpha);
	}

	// Retourne y en fonction d'un angle, d'une ordonnée d'origine (généralement o.y), et d'une distance
	function getY(alpha, offsetY, radius){
		return offsetY-radius*Math.sin(alpha);	
	}

	// Ajoute les coordonées aux checks
	function checkCoords(rawChecks){
		$.each(rawChecks, function(key, value){
			value.alpha = getAlpha(value.h);
			value.x1 = getX(value.alpha, o.x, ro);
			value.y1 = getY(value.alpha, o.y, -ro);
			value.x2 = getX(value.alpha, o.x, ro+value.d);
			value.y2 = getY(value.alpha, o.y, -Math.abs(ro+value.d));
		});
		return rawChecks;
	}

	// Fonction qui permet de dessiner un arc en fonction d'un départ et d'une t'aille (en radian)
	var arcFunction = d3.svg.arc()
		.innerRadius(function(d){return d.innerRadius;})
		.outerRadius(function(d){return d.outerRadius;})
		.startAngle(function(d){return d.start;})
		.endAngle(function(d){return d.start + d.size;});

	// Génère les coordonées d'un text
	function textCoords(textJson){
		$.each(textJson, function(key, value){
			value.alpha = getAlpha(value.h)
			value.x = o.x+rh*Math.cos(value.alpha);
			value.y = o.y+rh*Math.sin(value.alpha);
		});
		return textJson;
	}

	// Génère les coordonées d'un arc de cercle par tips
	function tipsCoords(tipsJson){
		$.each(tipsJson, function(key, value){
			value.alpha = getAlpha(value.h);
			value.size = 0.03;
			value.start = value.alpha+pi/2-value.size/2;
			value.innerRadius = ro;
			value.outerRadius = ro;
		});
		return tipsJson;
	}

	// Génère les coordonées de l'arc de cercle pour la moyenne horaire des tips
	function checksAvgCoords(checkAvgJson){
		var  checkEnd = checkAvgJson.pop(),
			checkStart = checkAvgJson.pop();
		return [{start: checkStart.h*(pi/12), size: Math.abs(checkStart.alpha-checkEnd.alpha), innerRadius: ro, outerRadius: ro}];
	}

	// Génère les coordonées d'un arc de cercle par catégorie
	function catCoords(catJson){
		var jsonlength = Object.keys(catJson).length;
		var	catsize = 2*pi/(jsonlength+1);
		var pas = catsize / jsonlength;
		$.each(catJson, function(key, value){
			value.alpha = key*(catsize+pas);
			value.size = catsize;
			value.start = value.alpha;
			value.innerRadius = ro;
			value.outerRadius = ro;
		});
		return catJson;
	}

	// Génère les cercles d'échelles
	function echelleGenerator(cClass, myData){
		var echelleCircle = svg.selectAll('.'+cClass)
			.data(myData)
			.enter()
			.append('circle')
			.attr('class', cClass)
			.attr('r', 0)
			.attr('cx', o.x)
			.attr('cy', o.y)
			.style('fill', 'none')
			.style('stroke', cc)
			.style('stroke-dasharray',('2, 2'))
			.style('stroke-width', 1);

		return echelleCircle;
	}
	
	// Génère un groupe contenant un cercle couleur bg et un texte en son centre
	function textCircleGenerator(gClass, myData){
		var group = svg.selectAll(gClass)
			.data(myData)
			.enter()
			.append('g')
			.attr('class', '.'+gClass);
		group.append('circle')
			.attr('r', 12)
			.attr('cx', function(d){return d.x;})
			.attr('cy', function(d){return d.y;})
			.attr('fill', bgc);
		group.append('text')
			.attr('x', function(d){return d.x;})
			.attr('y', function(d){return d.y+4;}) // pour centrer verticalement
			.attr('fill', cc)
			.attr('text-anchor', 'middle')
			.attr('font-size', 12)
			.text(function(d){return d.t;});
		group.style('opacity', 0);

		return group;
	}

	// Génère le texte par dessus les échelles
	function textEchelleGenerator(tClass, myData){
		var indicateur = svg.selectAll('.'+tClass)
			.data(myData)
			.enter()
			.append('text')
			.attr('class', tClass)
			.attr('x', function(d, i){return getX(h[2].alpha, o.x, (i+2)*ro);})
			.attr('y', function(d, i){return getY(h[2].alpha, o.y, -(i+2)*ro);})
			.attr('fill', cc)
			.attr('text-anchor', 'middle')
			.attr('font-size', 10)
			.style('opacity', 0)
			.text(function(d){return d;});

		return indicateur
	}

	function decoCoords(decoJson){
		$.each(decoJson, function(key, value){
			value.alpha = getAlpha(value.h);
			value.x = getX(value.alpha, o.x, rd);
			value.y = getY(value.alpha, o.y, -rd);
		});
		return decoJson;
	}

	/*** Création sélecteurs***/
	var gcheck = svg.append('g').attr('id','gcheck');

	var checks = gcheck.selectAll('.checks')
		.data(checkJson)
		.enter()
		.append('line')
		.attr('class', 'checks')
		.attr('stroke', cc)
		.attr('stroke-width', 1)
		.attr('x1', function(d){return d.x1;})
		.attr('y1', function(d){return d.y1;})
		.attr('x2', function(d){return d.x1;})
		.attr('y2', function(d){return d.y1;});

	var tips = svg.selectAll('.tips')
		.data(tipsJson)
		.enter()
		.append('path')
		.attr('class', 'tips')
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('d', function(d){return arcFunction(d);})
		.attr('fill', tc)
		.style('opacity', 0.8);

	var checkAvg = svg.selectAll('.checkAvg')
		.data(checkAvgJson)
		.enter()
		.append('path')
		.attr('class', 'checkAvg')
		.attr('d', function(d){return arcFunction(d);})
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('fill', avgc)
		.style('opacity', 0.1);

	var dailyAvgChecks = svg.selectAll('.dailyAvgChecks')
		.data(dailyAvgChecksJson)
		.enter()
		.append('path')
		.attr('class', 'dailyAvgChecks')
		.attr('d', function(d){return arcFunction(d);})
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('fill', javgc)
		.style('opacity', 0.5);

	var dailyAvgTips = svg.selectAll('.dailyAvgTips')
		.data(dailyAvgTipsJson)
		.enter()
		.append('path')
		.attr('class', 'dailyAvgTips')
		.attr('d', function(d){return arcFunction(d);})
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('fill', javgc)
		.style('opacity', 0.5);

	var cat = svg.selectAll('.cat')
		.data(catJson)
		.enter()
		.append('path')
		.attr('class', 'cat')
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('d', function(d){return arcFunction(d);})
		.style('opacity', 0.5)
		.attr('fill', cac);

	/*** [END] Création selecteurs***/

	/*** Initialisation des échelles ***/
	var echelleDistance = echelleGenerator('echelleDistance', rdist);
	var echelleCat = echelleGenerator('echelleCat', rcat);
	var indicHoraire = textCircleGenerator('indicHoraire', h);
	var indicPourcent = textCircleGenerator('indicPourcent', m);
	var indicDistCheck = textEchelleGenerator('indicDistCheck', rdist);
	var indicCatSize = textEchelleGenerator('indicCatSize', rcat);

	/*** [END] Initialisation échelles ***/

	/*** Aparition des décoration ***/
	origine
 		.transition()
		.duration(1300)
		.delay(200)
		.attr('r', ro);

	cerlceVertInterne
		.transition()
		.duration(1300)
		.delay(200)
		.attr('r', rvi);

	cerlceVertInterneInvisible
		.transition()
		.duration(1300)
		.delay(200)
		.attr('r', rvii);

	cerlceVertExterne
		.transition()
		.duration(1300)
		.delay(200)
		.attr('r', rve);

	/*** [END] Aparition des décorations ***/

	/*** Gestion des survols ***/
	cat.on('mouseover', function(){
		d3.select(this)
			.transition()
			.duration(100)
			.style('opacity', 1);
	}).on('mouseout', function(){
		d3.select(this)
			.transition()
			.duration(300)
			.style('opacity', 0.5);
	});

	/*** [END] Gestion des survols ***/

	/*** Gestion des disparitions **/
	function hideCat(){
		cat
			.transition()
			.duration(1000)
			.delay(0)
			.attr('d', function(d){
				d.outerRadius = ro;
				return arcFunction(d);
			});

		indicCatSize
			.transition()
			.duration(1000)
			.delay(0)
			.style('opacity', 0);

		echelleCat
			.transition()
			.duration(1000)
			.delay(200)
			.attr('r', 0);
	}

	function hideCheck(){
		checks
			.transition()
			.duration(1000)
			.delay(200)
			.attr('x2', function(d){return d.x1;})
			.attr('y2', function(d){return d.y1;});

		tips
			.transition()
			.duration(1000)
			.delay(200)
			.attr('d', function(d){
				d.outerRadius = ro;
				return arcFunction(d);
			});

		checkAvg
			.transition()
			.duration(1000)
			.delay(200)
			.attr('d', function(d){
				d.outerRadius = ro;
				return arcFunction(d);
			});

		echelleDistance
			.transition()
			.duration(800)
			.delay(0)
			.attr('r', 0);

		indicDistCheck
			.transition()
			.duration(800)
			.delay(0)
			.style('opacity', 0);

		indicHoraire
			.transition()
			.duration(800)
			.delay(0)
			.style('opacity', 0);

		deco
			.transition()
			.duration(400)
			.delay(100)
			.attr('opacity', 0);

		echelleDeco
			.transition()
			.duration(400)
			.delay(0)
			.attr('r', rve)
			.transition()
			.style('opacity', 0);
	}

	function hideMoyenneChecks(){
		indicPourcent
			.transition()
			.duration(600)
			.delay(0)
			.style('opacity', 0);

		dailyAvgChecks
			.transition()
			.duration(600)
			.delay(200)
			.attr('d', function(d){
				d.outerRadius = ro;
				return arcFunction(d);
			});
	}

	function hideMoyenneTips(){
		indicPourcent
			.transition()
			.duration(600)
			.delay(0)
			.style('opacity', 0);

		dailyAvgTips
			.transition()
			.duration(600)
			.delay(200)
			.attr('d', function(d){
				d.outerRadius = ro;
				return arcFunction(d);
			});
	}

	function hideDecoStatique(){
		origine
	 		.transition()
			.duration(600)
			.delay(200)
			.attr('r', 0);

		cerlceVertInterne
			.transition()
			.duration(600)
			.delay(200)
			.attr('r', 0);

		cerlceVertInterneInvisible
			.transition()
			.duration(600)
			.delay(200)
			.attr('r', 0);

		cerlceVertExterne
			.transition()
			.duration(600)
			.delay(200)
			.attr('r', 0);

	}
	/*** [END] Gestion des disparitons ***/

	/*** Gestion des clics ***/
	d3.select('#deployChecks').on('click', function(){

		/*** Effacer les anciennes données ***/
		hideCat();
		hideMoyenneChecks();
		hideMoyenneTips();

		/*** [END] Effacer ***/

		/*** Afficher les nouvelles données ***/
		deco
			.transition()
			.duration(500)
			.delay(0)
			.attr('opacity', 1);

		echelleDeco
			.transition()
			.duration(500)
			.delay(0)
			.style('opacity', 0.2)
			.transition()
			.attr('r', rd);

		echelleDistance
			.transition()
			.duration(500)
			.delay(200)
			.attr('r', function(d, i){return (i+2)*ro;});

		indicDistCheck
			.transition()
			.duration(500)
			.delay(200)
			.style('opacity', 0.8);

		indicHoraire
			.transition()
			.duration(500)
			.delay(250)
			.style('opacity', 1);

		checks
			.transition()
			.duration(1000)
			.delay(600)
			.attr('x2', function(d){return d.x2;})
			.attr('y2', function(d){return d.y2;});

		tips
			.transition()
			.duration(1000)
			.delay(600)
			.attr('d', function(d){
				d.outerRadius = rve+10;
				return arcFunction(d);
			});

		checkAvg
			.transition()
			.duration(1000)
			.delay(700)
			.attr('d', function(d){
				d.outerRadius = rh;
				return arcFunction(d);
			});

		/*** [END] Afficher ***/
	});

	d3.select('#deployCat').on('click', function(){

		/*** Effacer les anciennes données ***/
		hideCheck();
		hideMoyenneChecks();
		hideMoyenneTips();

		/*** [END] Effacer ***/

		/*** Afficher les nouvelles données ***/
		echelleCat
			.transition()
			.duration(1000)
			.delay(200)
			.attr('r', function(d, i){return (i+2)*ro;});

		indicCatSize
			.transition()
			.duration(1000)
			.delay(1000)
			.style('opacity', 0.8);

		cat
			.transition()
			.duration(1000)
			.delay(700)
			.attr('d', function(d){
				d.outerRadius = ro + d.count;
				return arcFunction(d);
			});

		/*** [END] Afficher ***/
	});

	d3.select('#deployDailyChecks').on('click', function(){
		/*** Effacer les anciennes données ***/
		hideCheck();
		hideCat();
		hideMoyenneTips();

		/*** [END] Effacer ***/

		/*** Afficher les nouvelles données ***/
		dailyAvgChecks
			.transition()
			.duration(1000)
			.delay(1000)
			.attr('d', function(d){
				d.outerRadius = rh;
				return arcFunction(d);
			});

		indicPourcent
			.transition()
			.duration(1000)
			.delay(0)
			.style('opacity', 1);

		/*** [END] Afficher ***/

	});

	d3.select('#deployDailyTips').on('click', function(){
		/*** Effacer les anciennes données ***/
		hideCheck();
		hideCat();
		hideMoyenneChecks();

		/*** [END] Effacer ***/

		/*** Afficher les nouvelles données ***/
		dailyAvgTips
			.transition()
			.duration(1000)
			.delay(1000)
			.attr('d', function(d){
				d.outerRadius = rh;
				return arcFunction(d);
			});

		indicPourcent
			.transition()
			.duration(1000)
			.delay(0)
			.style('opacity', 1);

		/*** [END] Afficher ***/

	});

	d3.select('#deconnexion').on('click', function(){
		/*** Effacer les données ***/
			hideCheck();
			hideCat();
			hideMoyenneChecks();
			hideMoyenneTips();
			hideDecoStatique();

		/*** [END] Effacer ***/
	});

	/*** [END] Gestion des clics ***/
}