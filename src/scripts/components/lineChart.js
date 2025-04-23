// Render line chart
export function renderLineChart(data) {
  const svg = d3.select("#line-chart svg");
  const groupedData = d3.group(data, (d) => d.date);

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.date)))
    .range([0, svg.node().clientWidth]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.price)])
    .range([svg.node().clientHeight, 0]);

  const line = d3
    .line()
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.price));

  svg
    .append("path")
    .datum(Array.from(groupedData.entries()))
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue");
}
