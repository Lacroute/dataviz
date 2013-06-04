$(document).ready(function(){
	var w = 700,
		h = 700,
		donnees = [120, 180, 60, 30, 90],
		x = d3.scale.ordinal().domain([10, 20, 30]).rangePoints([0, w], 1),
		y = 150;

	var svg = d3.select('#pool').append('svg:svg');

	// var firstLevelTest = svg.selectAll('.firstLevelTest')
	// 					.data(donnees)
	// 					.enter().append('line')
	// 					.attr('class', 'firstLevelTest')
	// 					.attr('x1', 50)
	// 					.attr('y1', 100)
	// 					.attr('x2', 50)
	// 					.attr('y2', 100)
	// 					.attr('stroke', 'black')
	// 					.attr('stroke-width', '1');

	// d3.select('#deployTest').on('click', function() {
	// 	firstLevelTest.attr('class', 'deployed');
	// 	firstLevelTest.transition().duration(300).delay(0).attr('x1', 100);
	// 	firstLevelTest.transition().duration(500).delay(300).attr('y1', function(d){return d;});
	// });


	var o = {x:400, y:300}, // point origine
		pi = Math.PI,
		r = [100, 150, 200], // rayon de distance
		ro = 50, // rayon origine
		rh = 250, // rayon horaire
		rvi = 269, // rayon vert interne
		rvii = 275, // rayon vert interne invisible
		rve = 290,
		h = [0, 3, 6, 9, 12, 15, 18, 21], // horaires
		json = [{h:0, d:10},{h:1, d:10},{h:2, d:150},{h:3, d:50},{h:4, d:5},{h:5, d:70},{h:6, d:65},{h:7, d:20},{h:8, d:70},{h:9, d:52},{h:10, d:29},{h:11, d:82},{h:12, d:14},{h:13, d:100},{h:14, d:32},{h:15, d:50},{h:16, d:80},{h:17, d:10},{h:18, d:35},{h:19, d:120},{h:20, d:60},{h:21, d:130},{h:22, d:30},{h:23, d:55}],
		bgc = '#00182b', // background color
		cc = '#f2f2f2', // check color
		rvc = '#2adb2a'; // rond vert color

	function getAlpha(h){
		return h*pi/12;
	}

	function getX(alpha, offsetX, radius){
		return offsetX+radius*Math.cos(alpha);
	}

	function getY(alpha, offsetY, radius){
		return offsetY+radius*Math.sin(alpha);	
	}

	for (var i = 0; i < h.length; i++) {
		alphaTmp = getAlpha(h[i]);
		h[i] = {
			val: h[i],
			alpha: alphaTmp,
			x: o.x+rh*Math.cos(alphaTmp),
			y: o.y-rh*Math.sin(alphaTmp)
		};
	}

	function setJson(rawChecks){
		$.each(rawChecks, function(key, value){
			value.alpha = getAlpha(value.h);
			value.x1 = o.x+ro*Math.cos(value.alpha);
			value.y1 = o.y-ro*Math.sin(value.alpha);
			value.x2 = o.x+(ro+value.d)*Math.cos(value.alpha);
			value.y2 = o.y-(ro+value.d)*Math.sin(value.alpha);
		});
		return rawChecks;
	}
	
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

	console.log(h);
	svg.append('circle').attr('id', 'origine').attr('r', ro).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 1);
	
	svg.append('circle').attr('id', 'horaire').attr('class', 'invisible').attr('r', rh).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 1);
	svg.append('circle').attr('r', rvi).attr('cx', o.x).attr('cy', o.y).style("fill", "none").style("stroke", rvc).style("stroke-width", 25);
	svg.append('circle').attr('r', rvii).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke-dasharray',('2, 2')).style('stroke', bgc).style("stroke-width", 15);
	svg.append('circle').attr('class', 'invisible').attr('r', rve).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', cc).style("stroke-width", 1);
	
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
		.attr("fill", cc)
		.attr('text-anchor', 'middle')
		.attr('font-size', 12)
		.text(function(d){return d.val;});

	var indics = svg.selectAll('.indics')
		.data(r)
		.enter()
		.append('text')
		.attr('class', '.indics')
		.attr('x', function(d){return getX(h[5].alpha, o.x, d);})
		.attr('y', function(d){return getY(h[5].alpha, o.y, d);})
		.attr("fill", cc)
		.attr('text-anchor', 'middle')
		.attr('font-size', 12)
		.text(function(d){return d;});

	var checks = svg.selectAll('.checks')
		.data(setJson(json))
		.enter()
		.append('line')
		.attr('class', 'checks')
		.attr('stroke', cc)
		.attr('stroke-width', 1)
		.attr('x1', function(d){return d.x1;})
		.attr('y1', function(d){return d.y1;})
		.attr('x2', function(d){return d.x1;})
		.attr('y2', function(d){return d.y1;});

	// var tips = svg.selectAll('.tips')
	// 	.data(tips)
	// 	.enter()
	// 	.append('polygon')
	// 	.attr('class', 'tips')
	// 	.attr('fill', 'red')
	// 	.attr('x1', function(d){return d.x1;})
	// 	.attr('y1', function(d){return d.y1;})
	// 	.attr('x2', function(d){return d.x1;})
	// 	.attr('y2', function(d){return d.y1;});


	// <polygon fill="lime" stroke="blue" stroke-width="10" points="850,75  958,137.5 958,262.5 850,325 742,262.6 742,137.5" />

	d3.select('#deploy').on('click', function(){
		checks
			.transition()
			.duration(500)
			.delay(200)
			.attr('x2', function(d){return d.x2;})
			.attr('y2', function(d){return d.y2;});
	});
});