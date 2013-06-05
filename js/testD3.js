$(document).ready(function(){
	var w = 700,
		h = 700,
		donnees = [120, 180, 60, 30, 90],
		x = d3.scale.ordinal().domain([10, 20, 30]).rangePoints([0, w], 1),
		y = 150;

	var svg = d3.select('#pool').append('svg:svg'),
		o = {x:400, y:300}, // point origine
		pi = Math.PI,
		r = [100, 150, 200], // rayon de distance
		ro = 50, // rayon origine
		rh = 250, // rayon horaire
		rvi = 269, // rayon vert interne
		rvii = 275, // rayon vert interne invisible
		rve = 290, // rayon vert externe
		h = [0, 3, 6, 9, 12, 15, 18, 21], // horaires
		checkJson = [{h:0, d:10},{h:1, d:10},{h:2, d:150},{h:3, d:50},{h:4, d:5},{h:5, d:70},{h:6, d:65},{h:7, d:20},{h:8, d:70},{h:9, d:52},{h:10, d:29},{h:11, d:82},{h:12, d:14},{h:13, d:100},{h:14, d:32},{h:15, d:50},{h:16, d:80},{h:17, d:10},{h:18, d:35},{h:19, d:120},{h:20, d:60},{h:21, d:130},{h:22, d:30},{h:23, d:55}],
		tips = [{h:12}],
		checkAvgJson = [{h:0, d:10},{h:3, d:5}],
		bgc = '#00182b', // background color
		cc = '#f2f2f2', // check color
		rvc = '#2adb2a', // rond vert color
		tc = '#0071dc', // tips color
		avgc = '#ff00ff'; // avg check color


	// Retourne un angle pour coordonnées polaires, ici demi cercle divisé en 12h dans le sens horaire avec un désalage de pi/2
	function getAlpha(h){
		return -h*pi/12+pi/2;
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
			value.x1 = o.x+ro*Math.cos(value.alpha);
			value.y1 = o.y-ro*Math.sin(value.alpha);
			value.x2 = o.x+(ro+value.d)*Math.cos(value.alpha);
			value.y2 = o.y-(ro+value.d)*Math.sin(value.alpha);
		});
		return rawChecks;
	}

	// Fonction qui fournit un path de ligne
	var lineFunction = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })
		.interpolate('linear-closed');

	// Fonction qui permet de dessiner un arc en fonction d'un départ et d'une t'aille (en radian)
	var arcFunction = d3.svg.arc()
		.innerRadius(ro)
		.outerRadius(rve)
		.startAngle(function(d){return d.start;})
		.endAngle(function(d){return d.start + d.size;});

	// Set coordonnées pour les horaires
	for (var i = 0; i < h.length; i++) {
		alphaTmp = getAlpha(h[i]);
		h[i] = {
			val: h[i],
			alpha: alphaTmp,
			x: o.x+rh*Math.cos(alphaTmp),
			y: o.y-rh*Math.sin(alphaTmp)
		};
	}
	
	// génère le triangle pour un ensemble de tips #old
	function tipsCoordsOld(rawTips){
		var tipsCoords = [],
			alphaTmp;
		$.each(rawTips, function(key, value){
			alphaTmp = getAlpha(value.h);
			tipsCoords[key] = [
				{x: getX(alphaTmp, o.x, ro), y: getY(alphaTmp, o.y, ro)},
				{x: getX(alphaTmp-0.015, o.x, rve), y: getY(alphaTmp-0.015, o.y, rve)},
				{x: getX(alphaTmp+0.015, o.x, rve), y: getY(alphaTmp+0.015, o.y, rve)},
			];
		});
		return tipsCoords;
	}

	// Génère les coordonées d'un arc de cercle par tips
	function tipsCoords(rawTips){
		$.each(rawTips, function(key, value){
			value.alpha = getAlpha(value.h);
			value.size = 0.03;
			value.start = value.alpha-pi/2-value.size/2;
		});
		return rawTips;
	}

	function checksAvgCoords(checkAvgJson){
		var  checkEnd = checkAvgJson.pop(),
			checkStart = checkAvgJson.pop();
		var test = {start: checkStart.alpha-pi/2, size: Math.abs(checkStart.alpha-checkEnd.alpha)};
		return test;
	}

	// Initialisation des données
	checkJson = checkCoords(checkJson);
	checkAvgJson = checksAvgCoords(checkCoords(checkAvgJson));
	tips = tipsCoords(tips);

	var echelle = svg.selectAll('circle')
		.data(r)
		.enter()
		.append('circle')
		.attr('class', 'invisible')
		.attr('r', function(d){return d;})
		.attr('cx', o.x)
		.attr('cy', o.y)
		.style('fill', 'none')
		.style('stroke', cc)
		.style('stroke-dasharray',('2, 2'))
		.style('stroke-width', 1);

	svg.append('circle').attr('id', 'origine').attr('r', ro).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 1);
	
	svg.append('circle').attr('id', 'horaire').attr('class', 'invisible').attr('r', rh).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 1);
	svg.append('circle').attr('r', rvi).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', rvc).style('stroke-width', 25);
	svg.append('circle').attr('r', rvii).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke-dasharray',('2, 2')).style('stroke', bgc).style('stroke-width', 15);
	svg.append('circle').attr('class', 'invisible').attr('r', rve).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', cc).style('stroke-width', 1);
	
	var heures = svg.selectAll('text')
		.data(h)
		.enter()
		.append('g');
	heures.append('circle')
		.attr('r', 10)
		.attr('cx', function(d){return d.x;})
		.attr('cy', function(d){return d.y;})
		.attr('fill', bgc);
	heures.append('text')
		.attr('x', function(d){return d.x;})
		.attr('y', function(d){return d.y+4;})
		.attr('fill', cc)
		.attr('text-anchor', 'middle')
		.attr('font-size', 12)
		.text(function(d){return d.val;});

	var indics = svg.selectAll('.indics')
		.data(r)
		.enter()
		.append('text')
		.attr('class', '.indics')
		.attr('x', function(d){return getX(h[h.length-1].alpha, o.x, d);})
		.attr('y', function(d){return getY(h[h.length-1].alpha, o.y, d);})
		.attr('fill', cc)
		.attr('text-anchor', 'middle')
		.attr('font-size', 10)
		.style('opacity', 0.8)
		.text(function(d){return d;});

	var checks = svg.selectAll('.checks')
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
		.data(tips)
		.enter()
		.append('path')
		.attr('class', 'tips')
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('d', function(d){return arcFunction(d);})
		.style('opacity', 0)
		.attr('fill', tc);

	var checkAvg = svg.append('path')
		.attr('id', 'checkAvg')
		.attr('d', function(){return arcFunction(checkAvgJson);})
		.attr('transform', function(){return 'translate('+o.x+','+o.y+')';})
		.attr('fill', avgc)
		.attr('opacity', 0);

	d3.select('#deploy').on('click', function(){
		checks
			.transition()
			.duration(500)
			.delay(200)
			.attr('x2', function(d){return d.x2;})
			.attr('y2', function(d){return d.y2;});

		tips
			.transition()
			.duration(500)
			.delay(700)
			.style('opacity', 0.8);

		checkAvg
			.transition()
			.duration(500)
			.delay(900)
			.style('opacity', 0.1);
	});
});