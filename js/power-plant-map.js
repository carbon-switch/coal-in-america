async function drawMap() {

  // Access data
  const dataset = await d3.csv("../data/power-plant-data.csv", d3.autoType)
  const usMapJson = await d3.json("../data/us-map-geojson.json")

  const plantLat = d => d.latitude
  const plantLong = d => d.longitude
  const plantGeneration = d => d.generation_mwh
  const plantEmissions = d => d.emissions_tons
  const plantFuelType = d => d.fuel_type

  // Filter criteria
  const fuel = "COAL"
  const topXinArray = 25

  //Sort data by largest generators
  const sortedDataset = dataset.slice().sort(function(a,b){
    return plantEmissions(b)-plantEmissions(a)
  })

  const filterByFuel = sortedDataset.filter(d => d.fuel_type == fuel);
  const dataToShow = filterByFuel.splice(0, topXinArray)



  // Create bounds for the map to go in as usual
  let dimensions = {
    width: window.innerWidth * 0.75,
    height: 500,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
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

  // Create scales and functions to be used in dot mapping

  const generationScale = d3.scaleLinear() // scale the dot size based on max and min of dataset
      .domain([1000000,25000000])
      .range([1,25])

  function coordProjection (d) {   // create x, y coordinates for dot based on lat and long
    return "translate("
    + projection([plantLong(d),plantLat(d)])
    + ")"
  }

  // function to determine dot color based on fuel type
  function colorChange (d) {
    let color = "white"
    if (plantFuelType(d) == "COAL")
      color = "#2F394B"
    else if (plantFuelType(d) == "GAS")
      color = "#E56B6F"
    else if (plantFuelType(d) == "HYDRO")
      color = "#355070"
    else if (plantFuelType(d) == "NUCLEAR")
      color = "#57cc99"
    else if (plantFuelType(d) == "OIL")
      color = "#D5D7DB"
    else if (plantFuelType(d) == "SOLAR")
      color = "#eaac8b"
    else if (plantFuelType(d) == "WIND")
      color = "#38a3a5"
    else if (plantFuelType(d) == "OTHF")
      color = "#orange"
    else
      color = "red"
    return color
  }

  // Create dots for each power plant and scale / color them
  const dotGroup = wrapper.append("g")

  const dots = dotGroup.selectAll("#circles")
    .data(dataToShow)
    .enter().append("circle")
      .attr("r", d => generationScale(plantGeneration(d)))
      .attr("transform", d => coordProjection(d))
      .attr("fill", d => colorChange(d))
      .attr("opacity", 0.7)


}

drawMap()
