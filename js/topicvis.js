TopicVis = function(_parentElement, _data, _metaData) {
   	this.parentElement = _parentElement;
    this.metaData = _metaData;
    this.displayData = _data;

    this.margin = {top: 40, right:0, bottom: 125, left:25};

    this.width = 400 - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;

    // SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Builds the axis and scales
    this.y = d3.scale.linear()
        .range([this.height, 0]);

    this.x = d3.scale.ordinal()
        .rangeRoundBands([0, this.width], .1);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .tickFormat(function(d) {return d;})
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.initVis();
}

TopicVis.prototype.initVis = function(){

	var that = this;

     // Add axis visual elements
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")");

    this.svg.append("g")
        .attr("class", "y axis");
    
    // Updates scales
    this.y.domain([0, d3.max(this.displayData.map(function (d) {return d["count"];}))]);
    this.x.domain(this.displayData.map(function(d) {return d["value"];}));

    // Updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
     .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {return "rotate(-65)";});
    this.svg.select(".y.axis")
        .call(this.yAxis);

    // Data join
    var bar = this.svg.selectAll(".bar")
        .data(this.displayData);

    // Add the bars
    var bar_enter = bar.enter().append("g");
    bar_enter.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return that.x(d["value"]);})
        .attr("y", function(d) {return that.y(d["count"]);})
        .attr("width", that.x.rangeBand())
        .attr("height", function(d) {return that.height - that.y(d["count"]);})
        .style("fill", "white");
    bar.exit().remove();

    // Fade in animation
    this.svg.selectAll(".bar").transition()
        .duration(1000)
        .style("fill", "#3987cb")

    // Append labels at the top of the bars
    var barLabel = this.svg.selectAll(".bar-label")
        .data(this.displayData)
        .enter().append("text")
            .attr("class", "bar-label")
            .attr("x", function(d) {return that.x(d["value"]) + (that.x.rangeBand()/2);})
            .attr("y", function(d) {return that.y(d["count"]) - 2; })
            .style("text-anchor", "middle")
            .text(function(d) {return d["count"]});
}
