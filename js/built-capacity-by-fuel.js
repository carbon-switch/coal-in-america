async function createBar () {

  // parse data from csv
  const data = await d3.csv("../data/capacity-by-fuel.csv", d3.autoType)
  const lessYears = data.slice(59)

  // chart dimensions
  const height = 600
  const width = 1000

  const margin = {
    top: 10,
    right: 15,
    bottom: 20,
    left: 40
  }


  // function to turn data into a stackable dataset
  const energyKey = data.columns.slice(1) // Grab the column names to use as keys later

  const series = d3.stack()
    .keys(energyKey) // sets the keys based on energyKey which is like the first row in an Excel sheet starting at column B
  (lessYears)
    .map(d => (d.forEach(v => v.key = d.key), d))


  // scales
  const x = d3.scaleBand()
      .domain(lessYears.map(d => d.Year))
      .range([margin.left, width - margin.right])
      .padding(0.1)

  const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]) // Find the max y1 value of the max
    .rangeRound([height - margin.bottom, margin.top])

  const colorKey = d3.schemeSpectral[series.length]
  const color = d3.scaleOrdinal()
    .domain(energyKey)
    .range(colorKey)
    .unknown("#ccc")

  // make the chart area and axis
  const chart = d3.select("#stacked-bar-wrapper")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const xAxis = chart.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues([1955, 1965, 1975, 1985, 1995, 2005, 2015]))

  const yAxis = chart.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(10, "s"))


/// Data for legend
  const legendX = 100
  const legendData = [
    {fuel: energyKey[0], hex: colorKey[0], x: legendX, y: 50},
    {fuel: energyKey[1], hex: colorKey[1], x: legendX, y: 75},
    {fuel: energyKey[2], hex: colorKey[2], x: legendX, y: 100},
    {fuel: energyKey[3], hex: colorKey[3], x: legendX, y: 125},
    {fuel: energyKey[4], hex: colorKey[4], x: legendX, y: 150},
    {fuel: energyKey[5], hex: colorKey[5], x: legendX, y: 175},
  ]

  // Make legend boxes and description
  const legendBoxes = chart.append("g")
    .selectAll("rect")
    .data(legendData)
    .join("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("height", 25)
      .attr("width", 25)
      .attr("fill", d => d.hex)

  const legendDes = chart.append("g")
    .selectAll("text")
    .data(legendData)
    .join("text")
      .attr("x", d => d.x + 30)
      .attr("y", d => d.y + 12.5 + ((16*0.85)/2)) // add half the height of boxes, then add half the height of the font. 1 rem = 16px. In CSS "text" is curently 0.85 rem
      .text(d => d.fuel)



  // Add chart data

    const barGroups = chart.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("class", "bar-groups")

    const theBars = barGroups.selectAll("rect")
      .data(d => d)
      .join("rect") // Set these attr before the transition since they stay consistent
        .attr("y", y(0)) // using the Yscale to start 0 point to transition from at 0 based on SVG (b/c it's opposite)
        .attr("x", d => x(d.data.Year)) // Accesses the year within data to place on X and scales to px value
        .attr("width", x.bandwidth()) // Sets width equally between all rects
        .attr("height", 0) // Starts rect height at 0 to animate up after transition is called
        .attr("fill", d => color(d.key))

    theBars
      .transition().duration(750) // Set these attr after the transition since they change
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("class", "initial-bar")


  // // Listen for click
  // const buttonListener = document.getElementById("stacked-button").addEventListener('click',function ()
  //   {
  //    updateData(series, "Natural Gas")
  //   })

    //function to just show a single energy source
    // theBars
    //   .transition().duration(750) // Set these attr after the transition since they change
    //     .attr("y", function (d) {
    //       if (d.key == f) {
    //         return y(0) - (y(d[0]) - y(d[1]))
    //       }
    //     })
    //     .attr("height", function (d) {
    //       if (d.key == f) {
    //         return y(d[0]) - y(d[1])
    //       }
    //     })



}

createBar()
