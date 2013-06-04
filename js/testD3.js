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


	var o = {x:400, y:300},
		pi = Math.PI,
		r = [50, 100, 150, 200, 250],
		ro = 50,
		r2,
		json = [{h:0, d:10},{h:1, d:10},{h:2, d:150},{h:3, d:50},{h:4, d:5},{h:5, d:70},{h:6, d:65},{h:7, d:20},{h:8, d:70},{h:9, d:52},{h:10, d:29},{h:11, d:82},{h:12, d:14},{h:13, d:100},{h:14, d:32},{h:15, d:50},{h:16, d:80},{h:17, d:10},{h:18, d:35},{h:19, d:120},{h:20, d:60},{h:21, d:130},{h:22, d:30},{h:23, d:55}],
		colors = ['blue', 'green', 'yellow', 'black'];

	function getAlpha(h){
		return h*pi/12;
	}

	function setJson(checks){
		$.each(checks, function(key, value){
			value.alpha = getAlpha(value.h);
			value.x1 = o.x+ro*Math.cos(value.alpha);
			value.y1 = o.y-ro*Math.sin(value.alpha);
			value.x2 = o.x+(ro+value.d)*Math.cos(value.alpha);
			value.y2 = o.y-(ro+value.d)*Math.sin(value.alpha);
		});
		return checks;
	}
	
	var cercles = svg.selectAll('circle')
		.data(r)
		.enter()
		.append('circle')
		.attr('r', function(d){return d;})
		.attr('cx', o.x)
		.attr('cy', o.y)
		.style('fill', 'none')
		.style('stroke', '#fff')
		.style('opacity', 0.2)
		.style('stroke-dasharray',('2, 3'))
		.style('stroke-width', 1);

	console.log(cercles);

	// svg.append('rect').attr('x', o.x-2).attr('y', o.y-2).attr('width', 4).attr('height', 4).style('fill', 'red');
//.attr('stroke', function(d, i){return colors[i];})
	var firstLevel = svg.selectAll('.firstLevel')
						.data(setJson(json))
						.enter().append('line')
						.attr('class', 'firstLevel')
						.attr('stroke', '#fff')
						.attr('stroke-width', '1')
						.attr('x1', function(d){return d.x1;})
						.attr('y1', function(d){return d.y1;})
						.attr('x2', function(d){return d.x1;})
						.attr('y2', function(d){return d.y1;});

	d3.select('#deploy').on('click', function(){
		firstLevel
			.transition()
			.duration(500)
			.delay(200)
			.attr('x2', function(d){return d.x2;})
			.attr('y2', function(d){return d.y2;});
	});
});