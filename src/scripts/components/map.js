// Function to create the heatmaps for room types in Australia
// This function takes the data and renders heatmaps using D3.js
export function renderRoomTypeHeatmaps(data) { 
  const validData = data.filter(
    (d) =>
      d.latitude &&
      d.longitude &&
      d.latitude >= -43.5 &&
      d.latitude <= -10.5 &&
      d.longitude >= 112.5 &&
      d.longitude <= 153.5 &&
      d.room_type &&
      d.price
  );

  const roomTypes = [...new Set(validData.map((d) => d.room_type))];

  const width = 400;
  const height = 350;

  // projection for Australia
  const projection = d3
    .geoMercator()
    .center([120, -25])
    .scale(800)
    .translate([width / 2, height / 2]);

  // Create a container for the heatmaps
  const container = d3
    .select("#wa-heatmaps-container");
  container.html(""); // Clear previous content
  container
    .style("display", "grid")
    .style("grid-template-columns", "repeat(2, 1fr)")
    .style("gap", "20px");

  // Load GeoJSON de Western Australia
  d3.json("assets/data/australian-states.json")
    .then(function (waGeoJson) { 
      roomTypes.forEach((roomType) => {
        const roomData = validData.filter((d) => d.room_type === roomType); 
        const priceExtent = d3.extent(roomData, (d) => +d.price); 
        const colorScale = d3
          .scaleSequential(d3.interpolateWarm)
          .domain([20, 10000]); 
        const roomContainer = container
          .append("div")
          .style("position", "relative")
          .style("border", "1px solid #ddd")
          .style("padding", "10px")
          .style("background", "#f9f9f9");

        // Título
        roomContainer
          .append("h5")
          .style("margin-top", "0")
          .style("color", "#333")
          .text(`${roomType} `)
          .append("p")
          .attr("class", "text-xs text-secondary")
          .text(`${roomData.length} habitaciones`);

        // Crear SVG
        const svg = roomContainer
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        // Dibujar el contorno de Western Australia
        const path = d3.geoPath().projection(projection);
        svg
          .append("path")
          .datum(waGeoJson)
          .attr("d", path)
          .attr("fill", "#e8f4f8")
          .attr("stroke", "#4682B4")
          .attr("stroke-width", 1)
          ;

        // Crear el mapa de calor
        const heatPoints = svg
          .selectAll(".heat-point")
          .data(roomData)
          .enter()
          .append("circle")
          .attr("class", "heat-point")
          .attr("cx", (d) => projection([+d.longitude, +d.latitude])[0])
          .attr("cy", (d) => projection([+d.longitude, +d.latitude])[1])
          .attr("r", (d) =>
            Math.max(
              3,
              Math.min(
                8,
                ((+d.price - priceExtent[0]) /
                  (priceExtent[1] - priceExtent[0])) *
                  5 +
                  3
              )
            )
          ) // Radio proporcional al precio
          .attr("fill", (d) => colorScale(+d.price))
          .attr("opacity", 0.8)
          .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 10).attr("opacity", 1);
            showTooltip(event, d);
          })
          .on("mousemove", showTooltip)
          .on("mouseout", function () {
            d3.select(this)
              .attr("r", (d) =>
                Math.max(
                  3,
                  Math.min(
                    8,
                    ((+d.price - priceExtent[0]) /
                      (priceExtent[1] - priceExtent[0])) *
                      5 +
                      3
                  )
                )
              )
              .attr("opacity", 0.8);
            hideTooltip();
          });
        addPriceLegend(roomContainer, colorScale, priceExtent);
      });
    })
    .catch((error) => {
      console.error("Error loading GeoJSON:", error);
      // Mostrar mensaje de error si no se carga el GeoJSON
      container
        .append("div")
        .style("color", "red")
        .text(
          "Error al cargar los datos geográficos. Mostrando puntos sin mapa base."
        );
    });
}

export function showTooltip(event, d) {
  d3
    .select("#heatmap-tooltip")
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY - 20 + "px")
    .style("opacity", 1).html(`
        <strong>Precio:</strong> $${d.price}<br>
        ${
          d.neighbourhood
            ? `<strong>Barrio:</strong> ${d.neighbourhood}<br>`
            : ""
        }
        ${
          d.minimum_nights
            ? `<strong>Mínimo de noches:</strong> ${d.minimum_nights}`
            : ""
        }
      `);
}

export function hideTooltip() {
  d3.select("#heatmap-tooltip").style("opacity", 0);
}

// Function to add price legend
export function addPriceLegend(container, colorScale, extent) {
  const legendWidth = 200;
  const legendHeight = 20;

  const legend = container
    .append("div")
    // .style("display", "flex")
    .style("align-items", "center")
    .style("margin-top", "10px");

  // Gradiente de color
  const svgDefs = container
    .append("svg")
    .attr("width", 0)
    .attr("height", 0)
    .append("defs");

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  svgDefs
    .append("linearGradient")
    .attr("id", gradientId)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .selectAll("stop")
    .data(colorScale.ticks(5))
    .enter()
    .append("stop")
    .attr("offset", (d, i) => i / (5 - 1))
    .attr("stop-color", (d) => colorScale(d));

legend
  .append("h5")
  .attr("class", "fw-semibold text-dark fs-6")
  .style("margin", "0px")
  .text(`Precio`);

  legend
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", `url(#${gradientId})`);

  // label
  legend
    .append("p")
    .attr("class", "text-xs text-secondary") 
    .style("font-size", "12px")
    .text(`$ ${20} - $ ${10000}`);
}
