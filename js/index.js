
// Set the data URL
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// Set margins, widths and heights for the graph
var margin = {
  top: 100,
  right: 20,
  bottom: 30,
  left: 60 },

width = 920 - margin.left - margin.right,
height = 630 - margin.top - margin.bottom;

// Set X Axis dimensions
var x = d3.scaleLinear().
range([0, width]);

// Set Y Axis dimensions
var y = d3.scaleTime().
range([0, height]);

// Assign colours using the inbuilt D3 color cotegories
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Set the time format to minutes:seconds
var timeFormat = d3.timeFormat("%M:%S");

// Assign ticks (x and y axis)
var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

// Define the div for the tooltip
var div = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);

// Define the Scalr Vector Graphics Element
var svg = d3.select("body").append("svg").
attr("width", width + margin.left + margin.right).
attr("height", height + margin.top + margin.bottom).
attr("class", "graph").
append("g").
attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parsedTime;

// D3 Rendering Method
// Get the Url and pass the error &/or data recieved into a function
// Iterate over the data objects and augment the data within to suit (time and place)
d3.json(url, function (error, data) {
  if (error) throw error;
  data.forEach(function (d) {
    d.Place = +d.Place;
    console.log(d);
    var parsedTime = d.Time.split(':');
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });

  // Set the x Axis domain
  x.domain([d3.min(data, function (d) {
    return d.Year - 1;
  }),
  d3.max(data, function (d) {
    return d.Year + 1;
  })]);

  // Set the Y Axis domain
  y.domain(d3.extent(data, function (d) {
    return d.Time;
  }));

  // Append the Axis to the SVG element
  svg.append("g").
  attr("class", "x axis").
  attr("id", "x-axis").
  attr("transform", "translate(0," + height + ")").
  call(xAxis).
  append("text").
  attr("class", "x-axis-label").
  attr("x", width).
  attr("y", -6).
  style("text-anchor", "end").
  text("Year");

  // Append the y Axis to the SVG element
  svg.append("g").
  attr("class", "y axis").
  attr("id", "y-axis").
  call(yAxis).
  append("text").
  attr("class", "label").
  attr("transform", "rotate(-90)").
  attr("y", 6).
  attr("dy", ".71em").
  style("text-anchor", "end").
  text("Best Time (minutes)");

  // Append the Y axis 'title' to the SVG element
  svg.append('text').
  attr('transform', 'rotate(-90)').
  attr('x', -160).
  attr('y', -44).
  style('font-size', 18).
  text('Time in Minutes');

  // Assign all dots their data values, attributes and styles based on their data
  svg.selectAll(".dot").
  data(data).
  enter().append("circle").
  attr("class", "dot").
  attr("r", 6).
  attr("cx", function (d) {
    return x(d.Year);
  }).
  attr("cy", function (d) {
    return y(d.Time);
  }).
  attr("data-xvalue", function (d) {
    return d.Year;
  }).
  attr("data-yvalue", function (d) {
    return d.Time.toISOString();
  }).
  style("fill", function (d) {
    return color(d.Doping != "");
  }).
  on("mouseover", function (d) {
    div.style("opacity", .9);
    div.attr("data-year", d.Year);
    div.html(d.Name + ": " + d.Nationality + "<br/>" +
    "Year: " + d.Year + ", Time: " + timeFormat(d.Time) + (
    d.Doping ? "<br/><br/>" + d.Doping : "")).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY - 28 + "px");
  }).
  on("mouseout", function (d) {
    div.style("opacity", 0);
  });

  //title
  svg.append("text").
  attr("id", "title").
  attr("x", width / 2).
  attr("y", 0 - margin.top / 2).
  attr("text-anchor", "middle").
  style("font-size", "30px").
  text("Doping in Professional Bicycle Racing");

  //subtitle
  svg.append("text").
  attr("x", width / 2).
  attr("y", 0 - margin.top / 2 + 25).
  attr("text-anchor", "middle").
  style("font-size", "20px").
  text("35 Fastest times up Alpe d'Huez");

  // Define the graph legend
  var legend = svg.selectAll(".legend").
  data(color.domain()).
  enter().append("g").
  attr("class", "legend").
  attr("id", "legend").
  attr("transform", function (d, i) {
    return "translate(0," + (height / 2 - i * 20) + ")";
  });

  // Append legend squares to the SVG element
  legend.append("rect").
  attr("x", width - 18).
  attr("width", 18).
  attr("height", 18).
  style("fill", color);

  // Append legend squares to the SVG element
  legend.append("text").
  attr("x", width - 24).
  attr("y", 9).
  attr("dy", ".35em").
  style("text-anchor", "end").
  text(function (d) {
    if (d) return "Riders with doping allegations";else
    {
      return "No doping allegations";
    };
  });

});