console.log("Assignment 4-B");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

//Start importing data
queue()
    .defer(d3.csv,'data/fao_combined_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/metadata.csv',parseMetadata)
    .await(dataLoaded);

function parse(d){
    return{
        item: d.ItemName,
        year: +d.Year,
        value: +d.Value
    }
}

function parseMetadata(d){
}


function dataLoaded(error, data,metadata){

    var nestedData = d3.nest()
        .key(function(d){return d.item ;})
        .entries(data);

    console.log(nestedData);


    //using the same way as Exercise_1
    //lines
    plot.append('path')
        .attr('class','tea-data-line data-line')
        .datum(nestedData[0].values)
        .attr('d',lineGenerator);
    plot.append('path')
        .attr('class','coffee-data-line data-line')
        .datum(nestedData[1].values)
        .attr('d',lineGenerator);

    //areas
    plot.append('path')
        .attr('class','tea-data-area data-area')
        .datum(nestedData[0].values)
        .attr('d',areaGenerator);
    plot.append('path')
        .attr('class','coffee-data-area data-area')
        .datum(nestedData[1].values)
        .attr('d',areaGenerator);

    //Put the dots section below the paths, because the thing appended later comes on the top.
    //Otherwise the tooltip would not work for the mouse couldn't cover the circles.
    plot.selectAll('.tea-data-point')
        .data(nestedData[0].values)   //".values" is necessary, it asks for its .value field.
        .enter()
        .append('circle')
        .attr('class','tea-data-point data-point')
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)})
        .attr('r',10)
        .style('opacity',0)
        .call(attachTooltip);
    plot.selectAll('.coffee-data-point')
        .data(nestedData[1].values)
        .enter()
        .append('circle')
        .attr('class','coffee-data-point data-point')
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)})
        .attr('r',10)
        .style('opacity',0)
        .call(attachTooltip);


    /*//This way doesn't work and I'm still working on it.
     var timeSeries = d3.selectAll('path') //yields a selection of 0 <path> elements
     .data(nestedData) //joins to an array of two objects
     .enter()
     .append('path') //creates two new <path> elements as the enter set
     .attr('class', function(item){return item.key}) //each element will have class of either "coffee" or "tea"
     */

    //.attr('d', function(item){return lineGenerator(item.values);});


    /*//Weird shapes appear and I don't know why...
     var graphs = plot.selectAll('.graph')
     .data(nestedData)
     .enter()
     .append('g')
     .attr('class','graph');
     //so now I have two <g> elements, joined to the data object for tea and coffee, respectively

     graphs
     .append('path')
     //.attr('class','tea-data-line data-line')
     .attr('class', 'function(item){return item.key}' + '-data-line data-line')  //???
     .attr('d', function(d){return lineGenerator(d.values)})  //?: why does d.item not work here?

     graphs
     .selectAll('circle')
     .data(function(d){return d.values}) //!!!!!!!!!!!!!!!!!!!!!!!! This is the trickiest line !!!!!!!!!!!!!!!!!!!!!
     .enter()
     .append('circle')
     .attr('cx',function(d){return scaleX(d.year)})
     .attr('cy',function(d){return scaleY(d.value)})
     .attr('r',3);
     */
}


//Tooltip
//Remember to set up the tooltip box in html file, otherwise there would be nothing in the box
function attachTooltip(selection){
    selection
        .on('mouseenter',function(d){
            console.log(d.item);
            console.log(d.year);
            console.log(d.value);

            var tooltip = d3.select('.custom-tooltip');
            tooltip
                .transition()
                .style('opacity',1);

            tooltip.select('#type').html(d.item);
            tooltip.select('#year').html(d.year);
            tooltip.select('#value').html(d.value);
        })

        .on('mousemove',function(d){
            var xy = d3.mouse(document.getElementById('plot'));
            var left = xy[0], top = xy[1];
            //console.log(xy);

            var tooltip = d3.select('.custom-tooltip');   //tooltip needs to be defined here again because of scope

            tooltip
                .style('left',left+50+'px')
                .style('top',top+50+'px')
        })

        .on('mouseleave',function(d){
            var tooltip = d3.select('.custom-tooltip')
                .transition()
                .style('opacity',0);
        })
}


//line generator
var lineGenerator = d3.svg.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.value)})

var areaGenerator = d3.svg.area()
    .x(function(d){return scaleX(d.year)})
    .y0(height)
    .y1(function(d){return scaleY(d.value)})


