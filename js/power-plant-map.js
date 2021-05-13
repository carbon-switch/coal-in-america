async function drawMap() {

  // Access data
  const plantDataset = await d3.csv("../data/power-plant-data.csv", d3.autoType)
  const usMapJson = await d3.json("../data/us-map-geojson.json")
  const mineDataset = await d3.csv("../data/biggest-coal-mines.csv", d3.autoType)

  // plant accessors and filters
  const plantLat = d => d.latitude
  const plantLong = d => d.longitude
  const plantGeneration = d => d.generation_mwh
  const plantEmissions = d => d.emissions_tons
  const plantFuelType = d => d.fuel_type

  // Plant filter criteria
  const fuel = "COAL"
  const topPlantFilter = 25

  // Functions to filter power plants
  const sortedPlants = plantDataset.slice().sort(function(a,b){
    return plantEmissions(b)-plantEmissions(a)
  })
  const filterByFuel = sortedPlants.filter(d => d.fuel_type == fuel);
  const plantsToMap = filterByFuel.splice(0, topPlantFilter)


  // mine accessors
  const mineLat = d => d.lat
  const mineLong = d => d.lon
  const mineProduction = d => d.production

  const topMineFilter = 25
  const sortedMines = mineDataset.slice().sort(function(a,b){
    return mineProduction(b)-mineProduction(a)
  })
  const minesToMap = sortedMines.splice(0, topMineFilter)

  // Create bounds for the map to go in as usual
  let dimensions = {
    width: window.innerWidth * 0.75,
    height: 500,
  }

  // Set projection as Albers and create Path Generator function
  const projection = d3.geoAlbers() // tells d3 to use Albers projection
  const pathGenerator = d3.geoPath(projection); // creates a function to convert lat and long to path

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
      .domain([1000000,25000000])
      .range([1,25])

  const mineScale = d3.scaleLinear()
      .domain([5000000, 100000000])
      .range([1,25])

  function plantProjection (d) {   // create x, y coordinates for dot based on lat and long
    return "translate("
    + projection([plantLong(d),plantLat(d)])
    + ")"
  }

  function mineProjection (d) {   // create x, y coordinates for dot based on lat and long
    return "translate("
    + projection([mineLong(d),mineLat(d)])
    + ")"
  }


  // Create dots for each power plant and scale
  const plantGroup = wrapper.append("g")
  const plantDots = plantGroup.selectAll("#circles")
    .data(plantsToMap)
    .enter().append("circle")
      .attr("r", 5)
      .attr("transform", d => plantProjection(d))
      .attr("fill", "#2F394B")
      .attr("opacity", 0.7)

  // Create dots for each mine and scale
  const mineGroup = wrapper.append("g")
  const mineDots = mineGroup.selectAll("#circles")
    .data(minesToMap)
    .enter().append("circle")
      .attr("r", 5)
      .attr("transform", d => mineProjection(d))
      .attr("fill", "#E56B6F")
      .attr("opacity", 0.7)


}

drawMap()
