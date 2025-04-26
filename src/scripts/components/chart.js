
// Function to create the bar chart for room type frequency
// This function takes the grouped data and renders a bar chart using D3.js
export function renderRoomTypeFrecuencyBarChart(groupedData) {
  // groupedData is a Map with the frequency of each room type
  const frequencyData = Array.from(groupedData, ([room_type, count]) => ({
    room_type,
    count,
  }));

  // constants for the chart dimensions
  const margin = { top: 40, right: 30, bottom: 20, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    barPadding = 0.2;
    
  // clean up the previous chart
  d3.select("#room-type-frecuency-bar-chart svg").html("");

  // SVG
  const svg = d3
    .select("#room-type-frecuency-bar-chart svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 
  const x = d3
    .scaleBand()
    .domain(frequencyData.map((d) => d.room_type))
    .range([0, width])
    .padding(barPadding);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(frequencyData, (d) => d.count)])
    .range([height, 0]);

  // colors for the bars
  const color = d3
    .scaleOrdinal()
    .domain(frequencyData.map((d) => d.room_type))
    .range(d3.schemeTableau10);

  // Draw the x-axis
  svg
    .selectAll(".bar")
    .data(frequencyData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.room_type))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => height - y(d.count))
    .attr("fill", (d) => color(d.room_type));

  // add labels for room types
  svg
    .selectAll(".type-label")
    .data(frequencyData)
    .enter()
    .append("text")
    .attr("class", "type-label")
    .attr("x", (d) => x(d.room_type) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.count) - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text((d) => d.room_type);

  // add labels of count
  svg
    .selectAll(".count-label")
    .data(frequencyData)
    .enter()
    .append("text")
    .attr("class", "count-label")
    .attr("x", (d) => x(d.room_type) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.count) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .text((d) => d.count);
  
}
 
// Function to create the line chart for neighborhood and room type history
// This function takes the data and grouped data and renders a line chart using D3.js 
export function renderMonthNeighborhoodLineChart(data, groupedData) {
  
  const margin = { top: 40, right: 60, bottom: 50, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // clean up the previous chart
  d3.select("#neighborhood-room-type-his-chart svg").html("");

  // SVG
  const svg = d3
    .select("#neighborhood-room-type-his-chart svg") 
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Procesamiento de datos
  const roomTypes = Array.from(groupedData.keys());
  const months = Array.from(new Set(data.map((d) => d.month))).sort((a, b) => {
    const aNum = data.find((d) => d.month === a).month_number;
    const bNum = data.find((d) => d.month === b).month_number;
    return aNum - bNum;
  });

  // Preparar datos para el gráfico de líneas
  const lineData = roomTypes.map((roomType) => {
    return {
      roomType,
      values: months
        .map((month) => {
          const count =
            groupedData.get(roomType)?.get(month)?.values().next().value || 0;
          return {
            month,
            monthNumber: data.find((d) => d.month === month).month_number,
            count,
          };
        })
        .sort((a, b) => a.monthNumber - b.monthNumber),
    };
  });

  // Escalas
  const x = d3.scaleBand().domain(months).range([0, width]).padding(0.1);

  const maxCount = d3.max(lineData, (d) => d3.max(d.values, (v) => v.count));
  const y = d3
    .scaleLinear()
    .domain([0, maxCount || 1])
    .nice()
    .range([height, 0]);

  // Generador de línea
  const line = d3
    .line()
    .x((d) => x(d.month) + x.bandwidth() / 2)
    .y((d) => y(d.count))
    .curve(d3.curveMonotoneX);

  // Color por tipo de habitación
  const color = d3.scaleOrdinal().domain(roomTypes).range(d3.schemeTableau10);

  // Ejes
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("x", -10)
    .attr("y", 10)
    .style("text-anchor", "end");

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

  // Dibujar líneas
  svg
    .selectAll(".line")
    .data(lineData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .attr("fill", "none")
    .attr("stroke", (d) => color(d.roomType))
    .attr("stroke-width", 2);

  // Agregar puntos
  svg
    .selectAll(".dot")
    .data(
      lineData.flatMap((d) =>
        d.values.map((v) => ({ ...v, roomType: d.roomType }))
      )
    )
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.count))
    .attr("r", 4)
    .attr("fill", (d) => color(d.roomType))
    .append("title")
    .text((d) => `${d.roomType}\n${d.month}\nReservas: ${d.count}`);

  // Leyenda
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 150}, 20)`);

  roomTypes.forEach((roomType, i) => {
    const legendItem = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendItem
      .append("line")
      .attr("x1", 0)
      .attr("x2", 20)
      .attr("y1", 10)
      .attr("y2", 10)
      .attr("stroke", color(roomType))
      .attr("stroke-width", 2);

    legendItem
      .append("text")
      .attr("x", 30)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .text(roomType);
  });

  // Etiquetas
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Mes");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left + 15)
    .style("text-anchor", "middle")
    .text("Número de reservas");

   
}