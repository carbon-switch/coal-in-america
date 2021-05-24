async function drawMap() {

  // Access data
  const plantDataset = await d3.csv("../data/top-25-plants.csv", d3.autoType)
  const usMapJson = await d3.json("../data/us-map-geojson.json")


  // plant accessors and filters
  const plantLat = d => d.latitude
  const plantLong = d => d.longitude
  const plantGeneration = d => d.generation_mwh
  const plantEmissions = d => d.emissions_tons
  const retirementDate = d => d.retirement_date
  const retirementStatus = d => d.retirement_status


  // Create bounds for the map to go in as usual
  const divElement = document.getElementById('map-wrapper')
  const divWidth = divElement.offsetWidth

  let dimensions = {
    width: window.innerWidth * 0.75,
    height: 500,
  }

  // Set projection as Albers and create Path Generator function
  const projection = d3.geoAlbers() // tells d3 to use Albers projection
  const pathGenerator = d3.geoPath(projection); // creates a function to convert lat and long to path

  // Color scale for status of plant
  function colorChange (d) {
    let color = "white"
    if (retirementStatus(d) == "Planned") // Yellow-ish color
      color = "#ffa59e"
    // else if (retirementStatus(d) == "Partial Closure Planned") // Orange-ish color
    //   color = "#f77f00"
    else
      color = "#93003a" // red-ish color for "No Retirement Date"
    return color
  }


  //Create SVG element and append US map to the SVG
  const wrapper = d3.select("#map-wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewbox", "0 0 100% 100%")

  const mapGroup = wrapper.append("g") // group to keep things organized
  const usMap = mapGroup.selectAll("#theMap") // take GeoJSON and turn into US Map svg
    .data(usMapJson.features)
    .join("path")
      .attr("d", pathGenerator)
      .attr("class", "theMap")

  // Scales and geo converter
  const plantScale = d3.scaleLinear()
      .domain([10000000,25000000])
      .range([10,25])

  function plantProjection (d) {   // create x, y coordinates for dot based on lat and long
    return "translate("
    + projection([plantLong(d),plantLat(d)])
    + ")"
  }

  // Create dots for each power plant and scale
  const plantGroup = wrapper.append("g")
  const plantDots = plantGroup.selectAll("#circles")
    .data(plantDataset)
    .enter().append("circle")
      .attr("r", d => plantScale(plantEmissions(d)))
      .attr("transform", d => plantProjection(d))
      .attr("fill", "#5681b9")
      .attr("opacity", 0.7)

  function changeColor() {
    plantDots.transition()
        .attr("fill", d => colorChange(d))
  }

  enterView({
    selector: '.first-step',
    enter: function(el) {
      changeColor()
    },
    offset: 0.5,
    once: true,
  });

}

drawMap()
