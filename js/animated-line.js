async function drawChartArea() {

  const emissionsDataset = await d3.csv("data/us-historical-coal-emissions.csv", d3.autoType)

  const totalEmissions = d => d.emissions
  const dateParser = d3.timeParse("%Y")
  const year = d => dateParser(d.year)

  const divElement = document.getElementById('annual-emissions-wrapper')
  const divWidth = divElement.offsetWidth

  let dimensions = {
    width: divWidth,
    height: window.innerHeight * 0.75,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const xScale = d3.scaleTime()
      .domain(d3.extent(emissionsDataset, year))
      .range([0, dimensions.boundedWidth])

  // console.log()

  const yScale = d3.scaleLinear()
      .domain([500000000,2500000000])
      .range([dimensions.boundedHeight, 0])

  const lineGenerator = d3.line()
      .x(d => xScale(year(d)))
      .y(d => yScale(totalEmissions(d)))

  const wrapper = d3.select("#annual-emissions-wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // Draw axis

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickFormat(d3.format(".2s"))

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)


  function animateLine() {
    const line = bounds.append("path")
        .attr("d", lineGenerator(emissionsDataset))
        .attr("fill", "none")
        .attr("stroke", "#2F394B")
        .attr("stroke-width", 2)

    const totalLength = line.node().getTotalLength()

    line
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(10000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
  }

  enterView({
    selector: '#annual-emissions-wrapper',
    enter: function(el) {
      animateLine()
    },
    offset: 0.5,
    once: true,
  });

}

drawChartArea()
