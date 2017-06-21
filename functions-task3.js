var objArray = [{   // Object Array with x and y co-ordinates
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

// Create variables for holding our values later

var svg;                // SVG will reference the SVG element in the HTML
var width, height;      // The width and height of the SVG element
var padding;            // The padding around the edge of the SVG
var xmax, ymax;         // Max values or x and y co-ordinates
var xScale, yScale;     // Scales for x and y axis
var color;              // Scale for color
var xAxis, yAxis;       // x and y axis
var lineFunction;       // The line generator function
var line;               // The SVG element of the line

// Button Functions

function addData() {    // Function defining what to do when we click the "Add Data" button
  objArray.push({       // Add a new value to the Object Array
    x: 0,
    y: 4
  });
  refreshChart();       // Call update() to update the graph
}

function changeData() { // Function defining what to do when we click the "Change Data" button
  objArray[0] = {       // Change the first value in the Object Array
    x: 0.6,
    y: 7
  }
  refreshChart();       // Call update() to update the graph
}

function deleteData() { // Function defining what to do when we click the "Delete Data" button
  objArray.pop();       // Remove the last value from the Object Array
  refreshChart();       // Call update() to update the graph
}

// Create Function

function createChart() {            // This function will only be run once on start up
  svg = d3.select('svg');           // Select the SVG element and assign it to the svg variable
  width = svg.node().clientWidth;   // Set the width to the width of the SVG element
  height = svg.node().clientHeight; // Set the height to the height of the SVG element

  padding = 20;                     // Set the padding, 20 pixels allows space for axis

  svg.append('g')                   // Append a group SVG element to the SVG to hold the x axis
    .attr('class', 'x axis')        // Add the attribute "class" to the SVG and set it to "x axis"
                                    // Classes are how we assign global styling CSS
    .attr('transform', 'translate(0,' + (height - padding) + ')'); // Transform the axis to move the
                                                                   // the origin to the bottom left

  svg.append('g')                   // Append a group to hold the y axis
     .attr('class', 'y axis')        // Set the class to "y axis"
     .attr('transform', 'translate(' + padding + ',' + 0 + ')'); // Transform the origin to
                                                                 // bottom left (ignoring padding)

  // Define the line generator
  // More information about types of lines available here:
  // https://github.com/d3/d3-shape/blob/master/README.md#curves

  lineFunction = d3.line()          // Creates a new line generator and set it to lineFunction
    .curve(d3.curveMonotoneX);      // Define the type of line (eg. straight, curved, etc)

  line = svg.append('path');        // Append a path element to the SVG and assign this to line
}

// Refresh Chart Function

function refreshChart() {                 // This function will be run every time we change the data

  // Update the max values

  xmax = d3.max(objArray, function (d) {  // The max x value is updated
    return d.x;
  });

  ymax = d3.max(objArray, function (d) {  // The max y value is updated
    return d.y;
  });

  // Update the scales

  // Set x scale using max x value and the SVG width
  // This maps the data value to the respective position on the scale
  xScale = d3.scaleLinear().domain([0, xmax]).range([padding, width - padding]);

  // Set y scale using max y value and the SVG height
  // This maps the data value to the respective position on the scale
  yScale = d3.scaleLinear().domain([0, ymax]).range([height - padding, padding]);

  // Update the axis

  // Set the x axis and y axis variables/functions
  xAxis = d3.axisBottom(xScale);    // axisBottom means the text will appear below the axis
  yAxis = d3.axisLeft(yScale);      // axisLeft means the text will appear below the axis

  svg.select('.x.axis')     // Select the x axis
    .call(xAxis);           // Call the x axis function to assign that function to the SVG element
  svg.select('.y.axis')     // Select the y axis
    .call(yAxis);           // Call the y axis function to assign that function to the SVG element

  // Update the line function's x and y accessors
  // meaning the x and y values of each point in the line
  // this needs to be updated in case the x or y scale changes

  lineFunction              // Reference the line generator
    .x(function (d) {       // Set the x accessor
      return xScale(d.x);   // Update to use the new x scale
    })
    .y(function (d) {       // Set the y accessor
      return yScale(d.y);   // Update to use the new y scale
    });

  line.datum(objArray)            // Set the line's data to the new Object Array
    .transition().duration(2000)  // Over 2 seconds, perform the following transitions:
    .attr('d', lineFunction);     // Update the line
                                  // We update the line by changing its "d" attribute to the
                                  // returned value of the line generator

  // Update the data points

  var groups = svg.selectAll('g.datapoint')   // Select all the groups with the class "datapoint"
                                              //   and assign this to the groups variable
    .data(objArray);                          // Set the data to to the newly updated Object Array

  // UPDATE
  // This will be performed on ALL data points that currently exist in the graph

  groups.selectAll('circle')      // Select all the circles from within the selected groups variable
    .transition().duration(500)   // Over 0.5 seconds, perform the following transitions:
    .attr('r', 5)                 // Set the radius to 5
    .style('fill', 'black');      // Set the color fill to black

  // ENTER
  // This will be performed for each NEW data point that doesn't exist currently exist in the graph

  var groupsAdded = groups.enter()  // enter() defines that we only want to apply this to new values
                                    //   it returns a selection of the NEW groups which we assign to
                                    //   the groupsAdded variable
    .append('g')                    // Append a new group
    .attr('class', 'datapoint')     // Add a class "datapoint" so we can find these groups later
    .attr('transform', 'translate(' + xScale(0) + ',' + yScale(0) + ')');
                                    // Transform the datapoint to be at the origin 0,0 (bottom left)

  groupsAdded.append('circle')            // Append a circle to each of our NEW groups
    .attr('r', 10)                        // Set the radius to 10
    .on('mouseenter', function (d, i) {   // .on() tells D3 to wait for a specific event to occur
      d3.select(this.parentElement)       //   then run the function. In this case it's waiting for
        .selectAll('text')                //   the "mouseenter" event.
        .transition().duration(500)       // When a mouse enters the circle,
        .style('opacity', 1);             //   it changes the opacity of the respective text to 1
    })
    .on('mouseout', function (d, i) {     // When a mouse exits the circle, "mouseout" event occurs
      d3.select(this.parentElement)       // We can select the text by selecting the parent
                                          //   group element
        .selectAll('text')                // Then selecting all text within that group
        .transition().duration(500)       // Over 0.5 seconds, perform the following:
        .style('opacity', 0);             // Set the opacity to 0
    })
    .transition().duration(2000)          // Over 2 seconds, perform the following:
    .style('fill', 'green');              // Set the fill of the NEW circle to green

  groupsAdded.append('text')              // Append text to each of our NEW groups
    .text(function (d, i) {
      return '(' + d.x + ', ' + d.y + ')';  // Set the text to the x and y co-ordinates
    })
    .attr('transform', 'translate(-10, -5)')  // Tranform the text relative to the group
    .style('text-anchor', 'end')              // Set the style of the text
    .style('opacity', 0);

  // EXIT
  // This will be performed for each data point that has been REMOVED from the Object Array

  var groupsRemoved = groups.exit()   // exit() is the inverse of enter(), it defines that we only
                                      //   want to apply this to removed values and we assign the
                                      //   returned selection to the groupsRemoved variable
    .selectAll('circle')              // Select all the circles in these groups
    .transition().duration(500)       // Transition over 0.5 seconds:
    .attr('r', 20)                    // Set the radius to 20
    .transition().duration(500)       // Wait for the previous transition to finish
                                      //   then transition over 0.5 seconds:
    .attr('r', 0)                     // Set the radius to 0
    .remove();                        // Remove the circle from the SVG

  // ENTER + UPDATE
  // These updates will be applied to ALL data points, including old and new data points
  // Apart from the ones that have been removed

  svg.selectAll('g.datapoint')        // Select all remaining data point groups
    .transition().duration(2000)      // Transition over 2 seconds
    .attr('transform', function (d) {
      return 'translate(' + xScale(d.x) + ',' + yScale(d.y) + ')'; // Move the datapoint to their
    });                                                            // current x, y co-ordinate
}

// Run the Create and Update functions ONCE on page load to load the graph

createChart();
refreshChart();
