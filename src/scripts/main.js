// Main JavaScript file for the Airbnb Dashboard
import {
  getContainer,
  drawColSection,
  drawRowSection,
} from "./components/generic.js";
import { onLoadData, downloadCSV } from "./components/dataService.js";

// Constants for layout
const ROW_COUNT = 6;

//
const authors = [
  {
    name: "Bastidas Toledo, Carlos R",
    email: "carlosraul.bastidas341@comunidadunir.net",
  },
  {
    name: "Larrea Buste, Edwin R",
    email: "edwinrafael.larrea200@comunidadunir.net",
  },
  {
    name: "Enderica Ortega, Diego A",
    email: "diegoalfredo.enderica052@comunidadunir.net",
  },
  {
    name: "Quito Guachamin, Wilson D",
    email: "wilsondaniel.quito150@comunidadunir.net",
  },
];

// Initialize the layout
initializeLayout();

// Function to initialize the layout
function initializeLayout() {
  createHeader();
  createMainContainer();
  createSections();
  createFooter();

  onLoadData({
    months: [-1],
  });
}

// Function to create the header
function createHeader() {
  if (d3.select("#heatmap-tooltip").empty()) {
    d3.select("body")
      .append("div")
      .attr("id", "heatmap-tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(255, 255, 255, 0.9)")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "10")
      .style("font-size", "12px")
      .style("max-width", "200px");
  }

  const header = d3.select("#main-body").append("header");

  header
    .append("div")
    .attr("class", "row")
    .append("h2")
    .text("Airbnb - Western Australia");
  header.append("div").attr("class", "row").attr("id", "header-container");
}

// Function to create the main container
function createMainContainer() {
  // Create a main container for the dashboard
  d3.select("#main-body")
    .append("main")
    .attr("class", "container-fluid --bs-light")
    .append("div")
    .attr("class", "text-center")
    .attr("id", "main-container");

  // Create a grid layout for the main container
  createRows(ROW_COUNT);
}

// Function to create rows dynamically in the main container
function createRows(rowCount) {
  const mainContainer = getContainer("#main-container");

  // Create a grid layout for the main container
  for (let i = 0; i < rowCount; i++) {
    mainContainer
      .append("div") // add a new <div> for each row
      .attr("class", "row") // assign a class "row" to each <div>
      .attr("id", `row-${i}`); // assign a unique id to each row
  }
}

// Function to create the footer
function createFooter() {
  const foot = d3.select("#main-body").append("footer");
  foot.append("p").text("Data from Airbnb, Western Australia - 2024");

  foot
    .append("button")
    .attr("id", "csvDownloadBtn")
    .attr("class", "btn btn-primary")
    .html('<i class="bi bi-download"></i> Descargar CSV')
    .on("click", downloadCSV);
}

// Function to create sections in the main container
function createSections() {
  // Create the introduction section
  createAuthorCards("#row-0");

  //#region Section 1: Line Chart for Neighborhood and Room Type History
  const LineChart1 = drawRowSection(
    getContainer("#row-1"),
    "neighborhood-room-type-his-chart",
    "Tendencia de disponibildiad por mes y tipo de habitación",
    "padding: 0"
  );
  LineChart1.append("div").attr("class", "card-graph").append("svg");
  // #endregion

  createFilterSection("#row-2");
  //#region Section 2: map for price distribution by room type
  createMapSection("#row-3");
  // #endregion
  //#region Section 3: Bar Chart for Room Type Frequency
  createChartsSection("#row-4");
  // #endregion
  //#region Section 4: Table for Price Distribution by Room Type
  createTableSection("#row-5");
  // #endregion
}

// Función para crear tarjetas con los perfiles
function createAuthorCards(containerId) {
  const container = getContainer(containerId);

  const cards = container
    .selectAll(".author-card")
    .data(authors)
    .enter()
    .append("div")
    .attr("class", "author-card col-3");

  cards
    .append("div")
    .attr("class", "author-icon")
    .text((d) => d.name.charAt(0));

  const info = cards.append("div");

  info
    .append("h5")
    .text((d) => d.name)
    .attr("class", "mb-0 fw-semibold text-dark fs-6")
    .style("font-size", "0.6rem");
  info
    .append("p")
    .text((d) => d.email)
    .attr("class", "mb-0 text-muted")
    .style("font-size", "0.6rem");
}

// Function to create the map section
function createMapSection(containerId) {
  const mapSection = getContainer(containerId);
  const mapBody = drawRowSection(
    mapSection,
    "map-div",
    "Distribución de precios por tipo de habitación",
    "padding: 0"
  );
  mapBody
    .append("div")
    .attr("class", "card-graph")
    .attr("id", "wa-heatmaps-container");
}

// Function to create the charts section
function createFilterSection(containerId) {
  const filterSection = getContainer(containerId)
    .append("div")
    .attr("class", "row");
  const filter = drawColSection(
    filterSection,
    "col-0",
    "Filtros",
    "padding: 0"
  );

  filter.html(` 
  <label for="monthSelect" class="form-label">Selecciona los meses</label>
  <select multiple class="form-select" id="monthSelect" style="height: 190px"  > 
  </select>
  <small class="text-muted">Usa Ctrl (o Cmd en Mac) para seleccionar varios meses.</small>
 `);
  filterSection.append("div").attr("class", "col").attr("id", "col-1");
}

// Function to create the charts section
function createChartsSection(containerId) {
  const chartsSection = getContainer(containerId);

  const barChart = drawRowSection(
    chartsSection,
    "room-type-frecuency-bar-chart",
    "Recuentos por Tipo de Habitación",
    "padding: 0"
  );

  barChart.append("div").attr("class", "card-graph").append("svg");
}

// Function to create the table section
function createTableSection(containerId) {
  const tableSection = drawRowSection(
    getContainer(containerId),
    "table-section",
    "Top 10 de barrios por precio y tipo de habitación",
    "padding: 0"
  );

  tableSection
    .append("div")
    .attr("class", "card-graph")
    .append("div")
    .attr("class", "table-responsive")
    .attr("id", "table-container");
}
