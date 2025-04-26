// Function to get whatever container is passed as an argument
export function getContainer(containerId) {
  return d3.select(containerId);
}

// Function to create a box section in the main container
export function drawRowSection(
  container,
  identifier,
  textHeader = "",
  style = ""
) {
  return drawSection(container, identifier, "row", textHeader, style);
}

// Function to create a map section in the main container
export function drawColSection(
  container,
  identifier,
  textHeader = "",
  style = ""
) {
  return drawSection(container, identifier, "col", textHeader, style);
}

// Function to create a section in the main container
// This function is used to create a section in the main container
export function drawSection(
  container,
  identifier,
  sectionType,
  textHeader = "",
  style = ""
) {
  const barChart = container
    .append("div")
    .attr("class", sectionType)
    .append("div")
    .attr("class", "card")
    .attr("id", identifier)
    .attr("style", style);

  if (textHeader !== "") {
    barChart.append("div").attr("class", "card-header").text(textHeader);
  }
  return barChart.append("div").attr("class", "card-body");
}
