var objArray = [{
	x: 1,
	y: 4
}, {
	x: 2,
	y: 10
}, {
	x: 1,
	y: 3
}, {
	x: 2,
	y: 4
}];

var svg;
var width, height;
var padding;
var xmax, ymax;
var xScale, yScale;
var color;
var xAxis, yAxis;
var line;
var lineFunction;

function addData() {
	objArray.push({
		x: 0,
		y: 4
	});
	update();
}

function changeData() {
	objArray[0] = {
		x: 0.6,
		y: 7
	}
	update();
}

function deleteData() {
	objArray.pop();
	update();
}


function create() {
	svg = d3.select('svg');
	width = svg.node().clientWidth;
	height = svg.node().clientHeight;

	padding = 20;

	svg.append('g')
		.attr('class', 'x axis')
		.attr("transform", "translate(0," + (height - padding) + ")");

	svg.append('g')
		.attr('class', 'y axis')
		.attr("transform", "translate(" + padding + "," + 0 + ")");

	lineFunction = d3.line()
		.curve(d3.curveMonotoneX);

	line = svg.append('path');
}

create();
update();

function update() {
	xmax = d3.max(objArray, function (d) {
		return d.x;
	});

	ymax = d3.max(objArray, function (d) {
		return d.y;
	});

	xScale = d3.scaleLinear().domain([0, xmax]).range([padding, width - padding]);
	yScale = d3.scaleLinear().domain([0, ymax]).range([height - padding, padding]);

	xAxis = d3.axisBottom(xScale);
	yAxis = d3.axisLeft(yScale);

	svg.select('.x.axis')
		.call(xAxis);
	svg.select('.y.axis')
		.call(yAxis);

	lineFunction
		.x(function (d) {
			return xScale(d.x);
		})
		.y(function (d) {
			return yScale(d.y);
		});

	line.datum(objArray)
		.transition().duration(2000)
		.attr('d', lineFunction);

	var groups = svg.selectAll('g.datapoint')
		.data(objArray);

	// UPDATE
	groups.selectAll('circle')
		.transition().duration(500)
		.attr('r', 5)
		.style('fill', 'black');

	// ENTER
	var groupsAdded = groups.enter()
		.append('g')
		.attr('class', 'datapoint')
		.attr('transform', 'translate(' + xScale(0) + ',' + yScale(0) + ')');

	groupsAdded.append('circle')
		.attr('r', 10)
		.on('mouseenter', function (d, i) {
			d3.select(this.parentElement)
				.selectAll('text')
				.transition().duration(500)
				.style('opacity', 1);
		})
		.on('mouseout', function (d, i) {
			d3.select(this.parentElement)
				.selectAll('text')
				.transition().duration(500)
				.style('opacity', 0);
		})
		.transition().duration(2000)
		.style('fill', function (d, i) {
			return 'green';
		});

	groupsAdded.append('text')
		.text(function (d, i) {
			return '(' + d.x + ', ' + d.y + ')';
		})
		.attr('transform', 'translate(-10, -5)')
		.style('text-anchor', 'end')
		.style('opacity', 0);

	// EXIT

	var groupsRemoved = groups.exit()
		.selectAll('circle')
		.transition().duration(500)
		.attr('r', 20)
		.transition().duration(500)
		.attr('r', 0)
		.remove();

	// ENTER + UPDATE

	svg.selectAll('g.datapoint')
		.transition().duration(2000)
		.attr('transform', function (d) {
			return 'translate(' + xScale(d.x) + ',' + yScale(d.y) + ')';
		});
}

function resize() {

}
