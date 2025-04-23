// Render bar chart
export function renderBarChart(data) {
  const svg = d3.select("#bar-chart svg");
  const cities = d3.group(data, (d) => d.city);
  const topCities = Array.from(cities.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  const x = d3
    .scaleBand()
    .domain(topCities.map((d) => d[0]))
    .range([0, svg.node().clientWidth])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(topCities, (d) => d[1].length)])
    .range([svg.node().clientHeight, 0]);

  svg
    .selectAll("rect")
    .data(topCities)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d[1].length))
    .attr("width", x.bandwidth())
    .attr("height", (d) => svg.node().clientHeight - y(d[1].length))
    .attr("fill", "steelblue");
}
