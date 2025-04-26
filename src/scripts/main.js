// Main JavaScript file for the Airbnb Dashboard
import {
  getContainer,
  drawColSection,
  drawRowSection,
} from "./components/generic.js";  
import { onLoadData } from "./components/dataService.js";

// Constants for layout
const ROW_COUNT = 5;

// Initialize the layout
initializeLayout();

// Function to initialize the layout
function initializeLayout() {
  createHeader();
  createMainContainer();
  createSections();
  createFooter();
  
  onLoadData();
}

// Function to create the header
function createHeader() {
  d3.select("#main-body")
    .append("header")
    .append("h2")
    .text("Airbnb - Western Australia");
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
  d3.select("#main-body")
    .append("footer")
    .append("p")
    .text("Data from Airbnb, Western Australia - 2024");
}

// Function to create sections in the main container
function createSections() {

//#region Section 0: Line Chart for Neighborhood and Room Type History
const LineChart1 = drawRowSection(
  getContainer("#row-0"),
  "neighborhood-room-type-his-chart",
  "Tendencia de reservas por mes y tipo de habitación",
  "padding: 0"
);
LineChart1.append("div").attr("class", "card-graph").append("svg"); 
// #endregion
//#region Section 2: Box Month Card
  createMapSection("#row-2");
  createChartsSection("#row-3");
  createTableSection("#row-4");
}

 
// Function to create the map section
function createMapSection(containerId) {
  const mapSection = getContainer(containerId);
  const mapBody = drawRowSection(mapSection, "map-div", "Distribución de precios por tipo de habitación", "padding: 0");
  mapBody
    .append("div")
    .attr("class", "card-graph")
    .attr("id", "wa-heatmaps-container");
}

// Function to create the charts section
function createChartsSection(containerId) {
  const chartsSection = getContainer(containerId)  ;

  const barChart = drawRowSection(
    chartsSection,
    "room-type-frecuency-bar-chart",
    "Recuentos por Tipo de Habitación",
    "padding: 0"
  ); 

  barChart
    .append("div")
    .attr("class", "card-graph")
    .append("svg");

}

// Function to create the table section
function createTableSection(containerId) {
  const tableSection = drawRowSection(
    getContainer(containerId),
    "table-section",
    ""
  );
  
  tableSection
    .append("div")
    .attr("class", "card-graph")
    .append("div")
    .attr("class", "table-responsive")
    .attr("id", "table-container") 
}
 