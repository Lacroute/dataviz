$(document).ready(function(){
	var w = 360,
		h = 180,
		data = [51, 69, 70],
		x = d3.scale.ordinal().domain([57, 32, 112]).rangePoints([0, w], 1),
    	y = d3.scale.ordinal().domain(data).rangePoints([0, h], 2);

	/*********************************************/
	var svg = d3.select('#pool').append('svg').attr('width', w).attr('height', h).attr('id', 'bleu');
	var circles = svg.selectAll('circle').data(data).enter().append("circle")
		.attr("class", "little")
		.attr("cx", x)
		.attr("cy", y)
		.attr("r", 12);

	var cirlesBlue = svg.selectAll('.little');
	d3.select('#makeBlue').on('click', function() {
		// event.preventDefault();
		// cirlesBlue.style('fill', 'steelblue').attr('cy', 90).attr('r', 30);
		cirlesBlue.transition().duration(500).delay(0).style('fill', 'steelblue');
    	cirlesBlue.transition().duration(500).delay(500).attr('cy', 90);
    	cirlesBlue.transition().duration(500).delay(1000).attr('r', 30);
    	console.log('Make Blue done');
	});

	/*********************************************/
	svg = d3.select('#pool').append('svg').attr('width', w).attr('height', h).attr('id', 'melanger');
	var circlesAlea = svg.selectAll('circle').data(data).enter().append("circle")
		.attr("class", "little")
		.attr("cx", x)
		.attr("cy", y)
		.attr("r", 12);

	d3.select('#randomize').on('click', function() {
		circlesAlea.transition().duration(500).attr('cx', function(){ return Math.random() * w;});
		console.log('Randomize done');
	});

	/*********************************************/
	svg = d3.select('#pool').append('svg').attr('width', w).attr('height', h).attr('id', 'donne');
	var g = svg.selectAll('.data')
		.data(data)
		.enter().append('g')
		.attr('class', 'data')
		.attr('transform', function(d, i) { return 'translate(' + 20 * (i + 1) + ',20)'; });

	g.append('text')
		.attr('dy', '.35em')
		.attr('text-anchor', 'middle')
		.text(String);

	g.append('rect')
		.attr('x', -10)
		.attr('y', -10)
		.attr('width', 20)
		.attr('height', 20);

	var circlesAlea = svg.selectAll('circle').data(data).enter().append("circle")
		.attr("class", "little")
		.attr("cx", x)
		.attr("cy", y)
		.attr("r", 12)
		.style('opacity', 0.5);

	d3.select('#bindData').on('click', function() {
		g.attr("transform", function(d, i) { return "translate(" + 20 * (i + 1) + ",20)"; })
			.select("rect")
			.style("opacity", 1);

		g.transition()
			.duration(750)
			.attr("transform", function(d) { return "translate(" + x(d) + "," + y(d) + ")"; })
			.select("rect")
			.style("opacity", 1e-6);

		console.log('Bind Data done');
	});

	/*********************************************/
	var svg = d3.select('#pool').append('svg').attr('width', w).attr('height', h);
	var g1 = svg.selectAll("g")
		.data(data)
		.enter().append("g")
		.attr("transform", function(d) { return "translate(" + x(d) + "," + y(d) + ")"; });

	g1.append('circle')
		.attr('class', 'little')
		.attr('r', 12);

	g1.append("text")
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.text(String);

















	/*********************************************/
	var matrix = [
	  [11975,  5871, 8916, 2868],
	  [ 1951, 10048, 2060, 6171],
	  [ 8010, 16145, 8090, 8045],
	  [ 1013,   990,  940, 6907]
	];

	var matrix3 = [
	  [
	  	[11975,  5871, 8916, 2868],
	  	[2,  5, 8, 26],
	  ],
	  [
	  	[1197500,  587100, 891600, 286800],
	  	[200,  500, 800, 26000],
	  ]
	];

	var li = d3.select('body').append('ul').selectAll('li')
		.data(matrix3)
		.enter().append('li').append('ul');

	var sub = li.selectAll('ul')
	    .data(function(d) { return d;})
		.enter()
	    .data(function(d) { return d; })
	    .enter().append('li')
	    .text(function(d) { return d; });
	});