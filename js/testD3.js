$(document).ready(function(){
	var w = 400,
		h = 400,
		donnees = [120, 180, 60, 30],
		x = d3.scale.ordinal().domain([10, 20, 30]).rangePoints([0, w], 1),
		y = 150;

	var svg = d3.select('#pool').append('svg:svg')
			.attr('width', w)
			.attr('height', h);

	var firstLevelTest = svg.selectAll('.firstLevelTest')
						.data(donnees)
						.enter().append('line')
						.attr('class', 'firstLevelTest')
						.attr('x1', 50)
						.attr('y1', 100)
						.attr('x2', 50)
						.attr('y2', 100)
						.attr('stroke', 'black')
						.attr('stroke-width', '2');

	d3.select('#deployTest').on('click', function() {
		firstLevelTest.attr('class', 'deployed');
		firstLevelTest.transition().duration(300).delay(0).attr('x1', 100);
		firstLevelTest.transition().duration(500).delay(300).attr('y1', function(d){return d;});
	});
	// <line x1="50" y1="50" x2="150" y2="150" stroke="black" stroke-width="2" />


	var o = {x:300, y:300},
		pi = Math.PI,
		r1 = 30,
		r2,
		heures = [0, 3, 13, 22],
		distance = [10, 50, 100, 30]
		alphas = [],
		coords = [],
		colors = ['blue', 'green', 'yellow', 'black'];

	function getAlpha(h){
		return h*pi/12;
	}

	function getCartesians(alpha){
		return{
			x1:o.x+r1*Math.cos(alpha),
			y1:o.y-r1*Math.sin(alpha),
			x2:o.x+r2*Math.cos(alpha),
			y2:o.y-r2*Math.sin(alpha)
		};
	}

	for (var i = 0; i < heures.length; i++) {
		r2 = r1+distance[i];
		alphas[i] = getAlpha(heures[i]);
		coords[i] = getCartesians(alphas[i]);
	};

	svg.append('circle').attr('r', r1).attr('cx', o.x).attr('cy', o.y).style('fill', 'none').style('stroke', 'black').style('stroke-width', 2);
	svg.append('rect').attr('x', o.x-2).attr('y', o.y-2).attr('width', 4).attr('height', 4).style('fill', 'red');
	var firstLevel = svg.selectAll('.firstLevel')
						.data(coords)
						.enter().append('line')
						.attr('class', 'firstLevel')
						.attr('stroke', function(d, i){return colors[i];})
						.attr('stroke-width', '2');

	console.log(alphas);
	console.log(coords);

	d3.select('#deploy').on('click', function(){
		firstLevel
			.transition()
			.duration(500)
			.delay(0)
			.attr('x1', o.x)
			.attr('y1', 0)
			.attr('x2', o.x)
			.attr('y2', -r1);

		firstLevel
			.transition()
			.duration(500)
			.delay(500)
			.attr('y1', o.y)
			.attr('y2', o.y-r1);	

		firstLevel
			.transition()
			.duration(500)
			.delay(1000)
			.attr('x1', function(d){return d.x1;})
			.attr('y1', function(d){return d.y1;})
			.attr('x2', function(d){return d.x2;})
			.attr('y2', function(d){return d.y2;})
	});
});