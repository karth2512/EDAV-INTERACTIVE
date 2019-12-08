console.log("ASDASaaaaaaaD")
window.data = {
}
$.ajax({
  url: "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/karth2512/EDAV-INTERACTIVE/master/MVC_B.json",
  success: function (data)
  {
    window.data["BOROUGH"] = JSON.parse(data)
  }
});
$.ajax({
  url: "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/karth2512/EDAV-INTERACTIVE/master/MVC_YB.json",
  success: function (data)
  {
    temp = JSON.parse(data)
    for(i in temp)
    {
      for (j in temp[i])
      {
        if ("BOROUGH-"+i in window.data)
        {
        window.data["BOROUGH-"+i][j] = temp[i][j]
        }
        else
        {
        window.data["BOROUGH-"+i] = {}
        window.data["BOROUGH-"+i][j] = temp[i][j]
        }
      }
    }
  }
});
$.ajax({
  url: "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/karth2512/EDAV-INTERACTIVE/master/MVC_YMB.json",
  success: function (data)
  {
    temp = JSON.parse(data)
    console.log(temp)
    for(i in temp)
    {
      for (j in temp[i])
      {
        window.data["BOROUGH-"+i+"-"+j] = temp[i][j]
      }
    }
    console.log(window.data)
  }
});
data = window.data;

d3.select("#BOROUGH").on("click",update);
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

function update() {
  var Y = document.getElementById("variable").value;
  var id = d3.select(this).attr("id");
  var fetchedData = data[d3.select(this).attr("id")];
  if(fetchedData == undefined)
  {
    $('#alertTitle').html("Data Error")
    $('#alertBody').html("Selected subdivision unavailable. Consider replotting for another variable")
    $('#alertModal').modal({ show: true})
  }
  svg.selectAll("text").remove();
  var title=id.split("-")
  if(title.length === 1)
  {
    $('#graphTitle').html(Y[0]+Y.toLowerCase().slice(1)+" per "+title[0].toLowerCase()+"")
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Boroughs");

  }
  else if(title.length===2)
  {
    $('#graphTitle').html(Y[0]+Y.toLowerCase().slice(1)+" in "+title[1][0]+title[1].toLowerCase().slice(1)+"")
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Years");
  }
  else
  {
    $('#graphTitle').html(Y[0]+Y.toLowerCase().slice(1)+" in "+title[1][0]+title[1].toLowerCase().slice(1)+" in "+ title[2])

  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Months");

  }


  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(Y);  

  x.domain(Object.keys(fetchedData))
  xAxis.call(d3.axisBottom(x))
  y.domain([0, d3.max(Object.values(fetchedData), function(d) { return d[Y] }) + 10 ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));
  var modData = []
  for(i in fetchedData)
  {
    var el = {}
    el[id+"-"+i] = fetchedData[i][Y]
    modData.push(el)
  }
  var u = svg.selectAll("rect")
    .data(modData)

  u.enter()
    .append("rect")
    .merge(u)
	.on("click",update)
    .transition().duration(1000)
      .attr("x", function(d) { return x(Object.keys(d)[0].split("-").splice(-1)[0]); })
      .attr("y", function(d) { return y(Object.values(d)[0]); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(Object.values(d)[0]); })
      .attr("fill", "#69b3a2")
      .attr("id", function(d) { return Object.keys(d)[0]; })

  u.exit()
    .remove()
}
