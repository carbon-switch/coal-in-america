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






async function sumIf () {

  const data = await d3.csv("data/power-plant-generators.csv", d3.autoType)
  console.table(data)





}

sumIf()
