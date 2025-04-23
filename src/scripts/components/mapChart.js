// Render map
export function renderMap(data) {
  const map = d3.select("#map");
  // Example: Add circles for listings
  data.forEach((d) => {
    map
      .append("div")
      .style("position", "absolute")
      .style("left", `${d.longitude * 10}px`) // Example scaling
      .style("top", `${d.latitude * 10}px`) // Example scaling
      .style("width", "10px")
      .style("height", "10px")
      .style("background-color", "red")
      .style("border-radius", "50%");
  });
}
